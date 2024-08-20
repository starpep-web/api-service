import { Router } from 'express';
import { asyncHandler } from '../../../../../middleware/controller';
import { get } from './getDatabaseHeatmap.controller';

export const attach = (router: Router) => {
  router.get('/statistics/heatmap/database', asyncHandler(get));
};
