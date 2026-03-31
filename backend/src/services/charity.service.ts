import { prisma } from '../config/prisma';

export const getCharities = async () => {
  return prisma.charity.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const createCharity = async (payload: {
  name: string;
  description: string;
  image: string;
  website: string;
  active: boolean;
}) => {
  return prisma.charity.create({ data: payload });
};

export const updateCharity = async (
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    image: string;
    website: string;
    active: boolean;
  }>
) => {
  return prisma.charity.update({
    where: { id },
    data: payload
  });
};

export const deleteCharity = async (id: string) => {
  return prisma.charity.delete({ where: { id } });
};
