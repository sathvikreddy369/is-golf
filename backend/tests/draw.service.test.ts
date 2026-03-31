import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    score: {
      findMany: vi.fn()
    },
    payment: {
      findMany: vi.fn()
    },
    user: {
      findMany: vi.fn()
    },
    draw: {
      create: vi.fn()
    },
    drawResult: {
      create: vi.fn()
    },
    winner: {
      createMany: vi.fn()
    }
  }
}));

vi.mock('../src/config/prisma', () => ({
  prisma: prismaMock
}));

vi.mock('../src/config/env', () => ({
  env: {
    DRAW_POOL_PERCENTAGE: 0.5
  }
}));

import { runDraw } from '../src/services/draw.service';

describe('draw.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('splits prize pool by tier and creates winner records on publish', async () => {
    prismaMock.score.findMany.mockResolvedValue([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 1 },
      { value: 2 },
      { value: 3 }
    ]);
    prismaMock.payment.findMany.mockResolvedValue([{ subscriptionAmount: 100 }]);
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'u5', scores: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }] },
      { id: 'u4', scores: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 11 }] },
      { id: 'u3', scores: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 10 }, { value: 12 }] }
    ]);

    prismaMock.draw.create.mockResolvedValue({ id: 'draw-1', winningValues: [1, 2, 3, 4, 5] });
    prismaMock.drawResult.create
      .mockResolvedValueOnce({ tier: 'MATCH_5', perWinner: 20 })
      .mockResolvedValueOnce({ tier: 'MATCH_4', perWinner: 17.5 })
      .mockResolvedValueOnce({ tier: 'MATCH_3', perWinner: 12.5 });
    prismaMock.winner.createMany.mockResolvedValue({ count: 3 });

    const result = await runDraw({ mode: 'WEIGHTED', simulation: false });

    expect(prismaMock.drawResult.create).toHaveBeenCalledTimes(3);
    expect(prismaMock.winner.createMany).toHaveBeenCalledTimes(3);
    expect(result.drawResults).toHaveLength(3);
  });
});
