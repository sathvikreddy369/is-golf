import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { addScore, getScores } from '../services/score.service';

export const createScore = asyncHandler(async (req: Request, res: Response) => {
  const data = await addScore(req.user!.id, req.body.value, req.body.date);
  res.status(StatusCodes.CREATED).json(data);
});

export const listScores = asyncHandler(async (req: Request, res: Response) => {
  const data = await getScores(req.user!.id);
  res.status(StatusCodes.OK).json(data);
});
