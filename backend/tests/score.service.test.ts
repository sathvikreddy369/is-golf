import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    score: {
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn()
    }
  }
}));

vi.mock('../src/config/prisma', () => ({
  prisma: prismaMock
}));

import { addScore } from '../src/services/score.service';

describe('score.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps only the latest 5 scores and deletes oldest entries', async () => {
    prismaMock.score.create.mockResolvedValue({});

    prismaMock.score.findMany
      .mockResolvedValueOnce([
        { id: 's6' },
        { id: 's5' },
        { id: 's4' },
        { id: 's3' },
        { id: 's2' },
        { id: 's1' }
      ])
      .mockResolvedValueOnce([
        { id: 's6', value: 6 },
        { id: 's5', value: 5 },
        { id: 's4', value: 4 },
        { id: 's3', value: 3 },
        { id: 's2', value: 2 }
      ]);

    prismaMock.score.deleteMany.mockResolvedValue({ count: 1 });

    const result = await addScore('user-1', 10, new Date().toISOString());

    expect(prismaMock.score.deleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['s1']
        }
      }
    });

    expect(result).toHaveLength(5);
  });
});
