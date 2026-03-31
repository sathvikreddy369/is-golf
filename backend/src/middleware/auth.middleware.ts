import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/jwt';

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Missing or invalid auth token');
  }

  const token = authorization.split(' ')[1];
  req.user = verifyAccessToken(token);
  next();
};

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied');
    }

    next();
  };
};
