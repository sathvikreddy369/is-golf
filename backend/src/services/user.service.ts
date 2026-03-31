import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      charityId: true,
      isActive: true,
      emailNotifications: true,
      charity: true,
      subscription: true
    }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  payload: { fullName?: string; charityId?: string; emailNotifications?: boolean }
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      fullName: payload.fullName,
      charityId: payload.charityId,
      emailNotifications: payload.emailNotifications
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      charityId: true,
      emailNotifications: true,
      charity: true
    }
  });
};

export const getUserHistory = async (userId: string) => {
  const [scores, payments, subscription] = await Promise.all([
    prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.subscription.findUnique({ where: { userId } })
  ]);

  return {
    subscription,
    scores,
    payments
  };
};

export const getUserWinnings = async (userId: string) => {
  const winners = await prisma.winner.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const drawIds: string[] = [];
  for (const winner of winners) {
    if (!drawIds.includes(winner.drawId)) {
      drawIds.push(winner.drawId);
    }
  }

  const draws = drawIds.length
    ? await prisma.draw.findMany({
        where: {
          id: {
            in: drawIds
          }
        },
        select: {
          id: true,
          drawDate: true,
          winningValues: true,
          status: true
        }
      })
    : [];

  const drawMap = new Map<string, { drawDate: Date; winningValues: number[]; status: string }>();
  for (const draw of draws) {
    drawMap.set(draw.id, {
      drawDate: draw.drawDate,
      winningValues: draw.winningValues,
      status: draw.status
    });
  }

  return winners.map((winner) => {
    const draw = drawMap.get(winner.drawId);
    return {
      ...winner,
      drawDate: draw?.drawDate ?? null,
      winningValues: draw?.winningValues ?? [],
      drawStatus: draw?.status ?? null
    };
  });
};
