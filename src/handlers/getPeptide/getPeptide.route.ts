import { Router } from 'express';
import { asyncHandler } from '../../middleware/controller';
import { get } from './getPeptide.controller';

export const attach = (router: Router) => {
  router.get('/peptides', asyncHandler(get));
};
