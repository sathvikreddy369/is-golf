import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { getProfile, getUserHistory, getUserWinnings, updateProfile } from '../services/user.service';

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await getProfile(req.user!.id);
  res.status(StatusCodes.OK).json(profile);
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await updateProfile(req.user!.id, req.body);
  res.status(StatusCodes.OK).json(profile);
});

export const getUserHistoryController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getUserHistory(req.user!.id);
  res.status(StatusCodes.OK).json(data);
});

export const getUserWinningsController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getUserWinnings(req.user!.id);
  res.status(StatusCodes.OK).json(data);
});
