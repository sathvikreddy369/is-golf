import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import {
  cancelSubscription,
  createSubscription,
  getSubscriptionStatus,
  handleWebhookSimulation
} from '../services/subscription.service';

export const createSubscriptionController = asyncHandler(async (req: Request, res: Response) => {
  const data = await createSubscription(req.user!.id, req.body);
  res.status(StatusCodes.CREATED).json(data);
});

export const getSubscriptionStatusController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getSubscriptionStatus(req.user!.id);
  res.status(StatusCodes.OK).json(data);
});

export const webhookSimulationController = asyncHandler(async (req: Request, res: Response) => {
  const data = await handleWebhookSimulation(req.body);
  res.status(StatusCodes.OK).json(data);
});

export const cancelSubscriptionController = asyncHandler(async (req: Request, res: Response) => {
  const data = await cancelSubscription(req.user!.id);
  res.status(StatusCodes.OK).json(data);
});
