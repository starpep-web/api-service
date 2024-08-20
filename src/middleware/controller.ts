import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/helpers/http/error';

export const jsonBodyRequired = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body || !Object.keys(req.body).length) {
    next(new BadRequestError('A JSON body is required.'));
    return;
  }

  next();
};

export type HandlerFunction = (req: Request, res: Response, next?: NextFunction) => Promise<void> | void;
export const asyncHandler = (handler: HandlerFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};
