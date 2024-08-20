import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getPeptideDatabaseDistribution } from './getPeptideDatabaseDistribution.service';
import { ResponseBuilder } from '../../../../shared/helpers/http/response';

export const get = async (_req: Request, res: Response) => {
  const distribution = await getPeptideDatabaseDistribution();
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData({ distribution });

  res.status(response.code).send(response.build());
};
