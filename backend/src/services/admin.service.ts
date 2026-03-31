import { prisma } from '../config/prisma';

export const listUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      subscription: true,
      charity: true
    }
  });
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isActive }
  });
};

export const verifyWinner = async (
  id: string,
  payload: {
    proofImage?: string;
    verificationStatus: 'APPROVED' | 'REJECTED';
    payoutStatus?: 'PENDING' | 'PAID';
  }
) => {
  return prisma.winner.update({
    where: { id },
    data: {
      proofImage: payload.proofImage,
      verificationStatus: payload.verificationStatus,
      payoutStatus: payload.payoutStatus
    }
  });
};

export const getReports = async () => {
  const [totalUsers, payments, drawCount, publishedDraws] = await Promise.all([
    prisma.user.count(),
    prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
    prisma.draw.count(),
    prisma.draw.findMany({ where: { status: 'PUBLISHED' }, include: { results: true } })
  ]);

  let totalRevenue = 0;
  let totalCharityContributions = 0;
  for (const payment of payments) {
    totalRevenue += Number(payment.subscriptionAmount);
    totalCharityContributions += Number(payment.charityContribution);
  }

  const drawStats = [];
  for (const draw of publishedDraws) {
    let winners = 0;
    for (const result of draw.results) {
      winners += result.winnerIds.length;
    }

    drawStats.push({
      drawId: draw.id,
      date: draw.drawDate,
      poolAmount: Number(draw.poolAmount),
      winners
    });
  }

  return {
    totalUsers,
    totalRevenue,
    totalCharityContributions,
    drawCount,
    drawStats
  };
};
