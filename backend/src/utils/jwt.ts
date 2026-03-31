import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
