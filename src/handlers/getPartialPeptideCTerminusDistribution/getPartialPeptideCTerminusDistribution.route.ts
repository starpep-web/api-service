import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getPartialPeptideCTerminusDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/partial/c-terminus', asyncHandler(get));
};
