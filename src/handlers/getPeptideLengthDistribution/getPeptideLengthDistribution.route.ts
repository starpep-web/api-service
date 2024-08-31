import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getPeptideLengthDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/length', asyncHandler(get));
};
