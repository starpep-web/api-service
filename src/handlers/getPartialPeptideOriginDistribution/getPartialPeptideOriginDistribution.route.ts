import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getPartialPeptideOriginDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/partial/origin', asyncHandler(get));
};
