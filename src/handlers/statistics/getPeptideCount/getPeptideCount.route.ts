import { Router } from 'express';
import { asyncHandler } from '../../../middleware/controller';
import { get } from './getPeptideCount.controller';

export const attach = (router: Router) => {
  router.get('/statistics/peptide-count', asyncHandler(get));
};
