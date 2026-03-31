import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { createCharity, deleteCharity, getCharities, updateCharity } from '../services/charity.service';

export const listCharities = asyncHandler(async (req: Request, res: Response) => {
  const featured =
    req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;

  const data = await getCharities({
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
    category: typeof req.query.category === 'string' ? req.query.category : undefined,
    featured
  });
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
