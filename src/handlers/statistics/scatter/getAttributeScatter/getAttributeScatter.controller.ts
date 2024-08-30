import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getAttributeScatter } from './getAttributeScatter.service';
import { ResponseBuilder } from '../../../../shared/helpers/http/response';
import { BadRequestError } from '../../../../shared/helpers/http/error';
import { ErrorCode } from '../../../../shared/error/codes';
import { PeptideAttributes } from '../../../../shared/models/peptide';

export const get = async (req: Request, res: Response) => {
  const { x: xAttribute, y: yAttribute } = req.query;

  if (!PeptideAttributes.isRawAttributeNameValid(xAttribute)) {
    throw new BadRequestError('Invalid x provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }
  if (!PeptideAttributes.isRawAttributeNameValid(yAttribute)) {
    throw new BadRequestError('Invalid y provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  const scatter = await getAttributeScatter(xAttribute, yAttribute);
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(scatter);

  res.status(response.code).send(response.build());
};
