import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getAttributeScatter.controller';

export const attach = (router: Router) => {
  router.get('/statistics/scatter/attribute', asyncHandler(get));
};
