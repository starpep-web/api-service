import { Router } from 'express';
import { asyncHandler } from '../../../../../middleware/controller';
import { get } from './getPartialPeptideNTerminusDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/partial/n-terminus', asyncHandler(get));
};
