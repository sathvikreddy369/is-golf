import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createCharity, deleteCharity, getCharities, updateCharity } from '../services/charity.service';

export const listCharities = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getCharities();
  res.status(StatusCodes.OK).json(data);
});

export const createCharityController = asyncHandler(async (req: Request, res: Response) => {
  const data = await createCharity(req.body);
  res.status(StatusCodes.CREATED).json(data);
});

export const updateCharityController = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateCharity(req.params.id, req.body);
  res.status(StatusCodes.OK).json(data);
});

export const deleteCharityController = asyncHandler(async (req: Request, res: Response) => {
  await deleteCharity(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
