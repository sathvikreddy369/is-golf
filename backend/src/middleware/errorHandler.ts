import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: 'Database operation failed',
      code: error.code
    });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
};
