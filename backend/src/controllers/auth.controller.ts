import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { loginUser, registerUser } from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(StatusCodes.CREATED).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(StatusCodes.OK).json(result);
});
