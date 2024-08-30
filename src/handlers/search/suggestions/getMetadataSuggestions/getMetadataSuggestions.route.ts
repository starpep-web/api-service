import { Router } from 'express';
import { asyncHandler } from '../../../../middleware/controller';
import { get } from './getMetadataSuggestions.controller';

export const attach = (router: Router) => {
  router.get('/search/suggestions/metadata', asyncHandler(get));
};
