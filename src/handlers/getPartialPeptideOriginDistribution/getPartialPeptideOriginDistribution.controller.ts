import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getPartialPeptideOriginDistribution } from './getPartialPeptideOriginDistribution.service';
import { getValidatedPartialLimit } from '../../shared/validators/statistics';
import { ResponseBuilder } from '../../shared/helpers/http/response';

export const get = async (req: Request, res: Response) => {
  const limit = getValidatedPartialLimit(req.query.limit, 25);
  const distribution = await getPartialPeptideOriginDistribution(limit);
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(distribution);

  res.status(response.code).send(response.build());
};
