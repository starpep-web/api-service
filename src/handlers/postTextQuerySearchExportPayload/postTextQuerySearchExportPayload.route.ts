import { Router } from 'express';
import { asyncHandler, jsonBodyRequired } from '../../middleware/controller';
import { post } from './postTextQuerySearchExportPayload.controller';

export const attach = (router: Router) => {
  router.post('/search/text-query/export', jsonBodyRequired, asyncHandler(post));
};
