import express, { Express } from 'express';
import cors from 'cors';
import { logRequests } from '../middleware/logging';
import { handleError, routeNotFound } from '../middleware/handlers';
import { getApiRouter } from './api';

export const createApp = async (): Promise<Express> => {
  const app = express();
  app.use(cors());
  app.use(logRequests);

  app.options('*', cors());

  app.use('/', await getApiRouter());

  app.all('*', routeNotFound);
  app.use(handleError);

  return app;
};
