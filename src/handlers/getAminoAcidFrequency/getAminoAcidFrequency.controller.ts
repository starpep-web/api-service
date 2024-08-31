import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ResponseBuilder } from '../../shared/helpers/http/response';
import { BadRequestError } from '../../shared/helpers/http/error';
import { ErrorCode } from '../../shared/error/codes';
import { isFrequencyFilterValid } from './getAminoAcidFrequency.model';
import { getTotalAminoAcidFrequency, getFilteredAminoAcidFrequency } from './getAminoAcidFrequency.service';

export const get = async (req: Request, res: Response) => {
  const { type, filter } = req.query;

  if (typeof type !== 'undefined' && !isFrequencyFilterValid(type)) {
    throw new BadRequestError('Invalid type provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  const frequency = type && typeof filter === 'string' ?
    await getFilteredAminoAcidFrequency(type, filter) :
    await getTotalAminoAcidFrequency();
  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(frequency);

  res.status(response.code).send(response.build());
};
