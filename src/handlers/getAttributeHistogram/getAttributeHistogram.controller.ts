import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getAttributeHistogram } from './getAttributeHistogram.service';
import { isHistogramMethodValid } from './getAttributeHistogram.model';
import { ResponseBuilder } from '../../shared/helpers/http/response';
import { BadRequestError } from '../../shared/helpers/http/error';
import { ErrorCode } from '../../shared/error/codes';
import { PeptideAttributes } from '../../shared/entity/peptide/models';

export const get = async (req: Request, res: Response) => {
  const { attribute, method } = req.query;

  if (!PeptideAttributes.isRawAttributeNameValid(attribute)) {
    throw new BadRequestError('Invalid attribute provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }
  if (typeof method !== 'undefined' && !isHistogramMethodValid(method)) {
    throw new BadRequestError('Invalid method provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  const histogram = await getAttributeHistogram(attribute, method);
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(histogram);

  res.status(response.code).send(response.build());
};
