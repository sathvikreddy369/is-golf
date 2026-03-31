import { NextFunction, Request, Response } from 'express';
import xss from 'xss';

const sanitizeObject = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeObject(val);
    }

    return sanitized;
  }

  return value;
};

export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.body = sanitizeObject(req.body) as Record<string, unknown>;
  req.query = sanitizeObject(req.query) as Request['query'];
  next();
};
