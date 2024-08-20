import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import logger from '@moonstar-x/logger';
import { ApiResponseError, InternalServerError, ResourceNotFoundError } from '../shared/helpers/http/error';
import { ResponseBuilder } from '../shared/helpers/http/response';

type ErrorLike = Error & {
  toApiResponseError?: () => ApiResponseError
}
const resolveApiResponseError = (error: ErrorLike): ApiResponseError => {
  if (error instanceof ApiResponseError) {
    return error;
  }

  if (error.toApiResponseError) {
    return error.toApiResponseError();
  }

  return new InternalServerError(error.message);
};

export const handleError = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  const apiResponseError = resolveApiResponseError(error);

  if (apiResponseError.status === HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error(error);
  }

  const response = new ResponseBuilder().withError(apiResponseError);
  res.status(response.code).send(response.build());

  next();
};

export const routeNotFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ResourceNotFoundError('This route is not handled by the server.'));
};
