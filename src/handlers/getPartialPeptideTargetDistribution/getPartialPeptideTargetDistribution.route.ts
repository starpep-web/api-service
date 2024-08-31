import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getPartialPeptideTargetDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/partial/target', asyncHandler(get));
};
