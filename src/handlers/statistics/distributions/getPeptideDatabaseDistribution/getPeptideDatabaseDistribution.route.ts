import { Router } from 'express';
import { asyncHandler } from '../../../../middleware/controller';
import { get } from './getPeptideDatabaseDistribution.controller';

export const attach = (router: Router) => {
  router.get('/statistics/distribution/database', asyncHandler(get));
};
