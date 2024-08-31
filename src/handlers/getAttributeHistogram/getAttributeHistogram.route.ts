import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getAttributeHistogram.controller';

export const attach = (router: Router) => {
  router.get('/statistics/histogram/attribute', asyncHandler(get));
};
