import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getHealthStatus.controller';

export const attach = (router: Router) => {
  router.get('/health/status', asyncHandler(get));
};
