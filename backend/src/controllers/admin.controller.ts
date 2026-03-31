import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { getReports, listUsers, updateUserStatus, verifyWinner } from '../services/admin.service';

export const listUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const data = await listUsers();
  res.status(StatusCodes.OK).json(data);
});

export const updateUserStatusController = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateUserStatus(req.params.id, req.body.isActive);
  res.status(StatusCodes.OK).json(data);
});

export const verifyWinnerController = asyncHandler(async (req: Request, res: Response) => {
  const data = await verifyWinner(req.params.id, req.body);
  res.status(StatusCodes.OK).json(data);
});

export const reportsController = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getReports();
  res.status(StatusCodes.OK).json(data);
});
