import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getDatabaseHeatmap } from './getDatabaseHeatmap.service';
import { ResponseBuilder } from '../../shared/helpers/http/response';

export const get = async (_req: Request, res: Response) => {
  const heatmap = await getDatabaseHeatmap();
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(heatmap);

  res.status(response.code).send(response.build());
};
