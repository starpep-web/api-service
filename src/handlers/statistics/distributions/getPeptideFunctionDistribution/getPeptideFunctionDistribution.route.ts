import { Router } from 'express';
import { asyncHandler } from '../../../../middleware/controller';
import { get } from './getPeptideFunctionDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/function', asyncHandler(get));
};
