import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getStatusMessage } from './getHealthStatus.service';
import { ResponseBuilder } from '../../shared/helpers/http/response';

export const get = async (_req: Request, res: Response) => {
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(getStatusMessage());

  res.status(response.code).send(response.build());
};
