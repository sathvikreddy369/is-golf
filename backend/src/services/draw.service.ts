type DrawMode = 'RANDOM' | 'WEIGHTED';
type WinnerTier = 'MATCH_3' | 'MATCH_4' | 'MATCH_5';
import { env } from '../config/env';
import { prisma } from '../config/prisma';

const pickUniqueRandom = (size: number): number[] => {
  const set = new Set<number>();
  while (set.size < size) {
    set.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(set);
};

const pickWeighted = async (): Promise<number[]> => {
  const scores = await prisma.score.findMany();
  const frequency = new Map<number, number>();

  for (const score of scores) {
    frequency.set(score.value, (frequency.get(score.value) ?? 0) + 1);
  }

  if (frequency.size === 0) {
    return pickUniqueRandom(5);
  }

  const sorted = Array.from(frequency.entries()).sort((a, b) => b[1] - a[1]);
  const weighted = sorted.slice(0, 5).map(([value]) => value);

  while (weighted.length < 5) {
    const candidate = Math.floor(Math.random() * 45) + 1;
    if (!weighted.includes(candidate)) {
      weighted.push(candidate);
    }
  }

  return weighted;
};

const getTierFromMatches = (matches: number): WinnerTier | null => {
  if (matches === 5) return 'MATCH_5';
  if (matches === 4) return 'MATCH_4';
  if (matches === 3) return 'MATCH_3';
  return null;
};

const tierShare = (tier: WinnerTier) => {
  if (tier === 'MATCH_5') return 0.4;
  if (tier === 'MATCH_4') return 0.35;
  return 0.25;
};

export const runDraw = async (input: { mode: DrawMode; simulation: boolean }) => {
  const winningValues = input.mode === 'RANDOM' ? pickUniqueRandom(5) : await pickWeighted();

  const successfulPayments = await prisma.payment.findMany({
    where: { status: 'SUCCESS' }
  });

  let gross = 0;
  for (const payment of successfulPayments) {
    gross += Number(payment.subscriptionAmount);
  }
  const poolAmount = gross * env.DRAW_POOL_PERCENTAGE;

  const activeUsers = await prisma.user.findMany({
    where: {
      isActive: true,
      subscription: {
        status: 'ACTIVE'
      }
    },
    include: {
      scores: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  const tierWinners: Record<WinnerTier, string[]> = {
    MATCH_3: [],
    MATCH_4: [],
    MATCH_5: []
  };

  for (const user of activeUsers) {
    let matches = 0;
    for (const score of user.scores) {
      if (winningValues.includes(score.value)) {
        matches += 1;
      }
    }
    const tier = getTierFromMatches(matches);
    if (tier) {
      tierWinners[tier].push(user.id);
    }
  }

  const draw = await prisma.draw.create({
    data: {
      mode: input.mode,
      status: input.simulation ? 'SIMULATED' : 'PUBLISHED',
      winningValues,
      poolAmount
    }
  });

  const drawResults = [];

  for (const tier of ['MATCH_5', 'MATCH_4', 'MATCH_3'] as WinnerTier[]) {
    const winners = tierWinners[tier];
    const totalPrize = poolAmount * tierShare(tier);
    const perWinner = winners.length ? totalPrize / winners.length : 0;

    const result = await prisma.drawResult.create({
      data: {
        drawId: draw.id,
        tier,
        winnerIds: winners,
        totalPrize,
        perWinner
      }
    });

    drawResults.push(result);

    if (!input.simulation && winners.length) {
      await prisma.winner.createMany({
        data: winners.map((userId) => ({
          userId,
          drawId: draw.id,
          tier,
          amount: perWinner
        }))
      });
    }
  }

  return {
    draw,
    drawResults
  };
};

export const getLatestDraw = async () => {
  return prisma.draw.findFirst({
    orderBy: { drawDate: 'desc' },
    include: {
      results: true
    }
  });
};
