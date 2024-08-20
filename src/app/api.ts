import { Router } from 'express';
import bodyParser from 'body-parser';
import { attachRoutes } from './attachRoutes';

export const getApiRouter = () => {
  const router = Router();
  router.use(bodyParser.json());

  return attachRoutes(router, '../handlers', (file) => import(file));
};
