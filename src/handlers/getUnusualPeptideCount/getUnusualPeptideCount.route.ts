import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getUnusualPeptideCount.controller';

export const attach = (router: Router) => {
  router.get('/statistics/count/unusual-peptides', asyncHandler(get));
};
