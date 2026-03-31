import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export const addScore = async (userId: string, value: number, date: string) => {
  await prisma.score.create({
    data: {
      userId,
      value,
      date: new Date(date)
    }
  });

  const allScores = await prisma.score.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (allScores.length > 5) {
    const extra = allScores.slice(5);
    await prisma.score.deleteMany({
      where: {
        id: {
          in: extra.map((score: { id: string }) => score.id)
        }
      }
    });
  }

  const scores = await prisma.score.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return scores;
};

export const getScores = async (userId: string) => {
  const scores = await prisma.score.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  if (!scores) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No scores found');
  }

  return scores;
};
