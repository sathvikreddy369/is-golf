import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { getLatestDraw, runDraw } from '../services/draw.service';

export const runDrawController = asyncHandler(async (req: Request, res: Response) => {
  const data = await runDraw(req.body);
  res.status(StatusCodes.CREATED).json(data);
});

export const latestDrawController = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getLatestDraw();
  res.status(StatusCodes.OK).json(data);
});
