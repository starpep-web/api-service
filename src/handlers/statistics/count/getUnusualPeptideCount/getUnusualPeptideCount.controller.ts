import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getUnusualPeptideCount } from './getUnusualPeptideCount.service';
import { ResponseBuilder } from '../../../../shared/helpers/http/response';

export const get = async (_req: Request, res: Response) => {
  const count = await getUnusualPeptideCount();
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData({ count });

  res.status(response.code).send(response.build());
};
