import { Router } from 'express';
import { asyncHandler, jsonBodyRequired } from '../../middleware/controller';
import { post } from './postTextQuerySearch.controller';

export const attach = (router: Router) => {
  router.post('/search/text-query', jsonBodyRequired, asyncHandler(post));
};
