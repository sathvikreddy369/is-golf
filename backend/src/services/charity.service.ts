import { prisma } from '../config/prisma';

export const getCharities = async (filters?: {
  search?: string;
  category?: string;
  featured?: boolean;
}) => {
  const search = filters?.search?.trim();
  const category = filters?.category?.trim();

  return prisma.charity.findMany({
    where: {
      active: true,
      ...(typeof filters?.featured === 'boolean' ? { featured: filters.featured } : {}),
      ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
  });
};

export const createCharity = async (payload: {
  name: string;
  category?: string;
  description: string;
  image: string;
  website: string;
  featured?: boolean;
  location?: string;
  upcomingEventTitle?: string;
  upcomingEventDate?: Date;
  impactMetric?: string;
  active: boolean;
}) => {
  return prisma.charity.create({ data: payload });
};

export const updateCharity = async (
  id: string,
  payload: Partial<{
    name: string;
    category: string;
    description: string;
    image: string;
    website: string;
    featured: boolean;
    location: string;
    upcomingEventTitle: string;
    upcomingEventDate: Date;
    impactMetric: string;
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
