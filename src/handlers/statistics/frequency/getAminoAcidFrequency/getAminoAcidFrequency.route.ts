import { Router } from 'express';
import { asyncHandler } from '../../../../middleware/controller';
import { get } from './getAminoAcidFrequency.controller';

export const attach = (router: Router) => {
  router.get('/statistics/frequency/amino-acids', asyncHandler(get));
};
