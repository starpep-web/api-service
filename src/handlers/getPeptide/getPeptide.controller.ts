import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { getPeptideById, getPeptideBySequence } from './getPeptide.service';
import { ResponseBuilder } from '../../shared/helpers/http/response';
import { BadRequestError, ResourceNotFoundError } from '../../shared/helpers/http/error';
import { ErrorCode } from '../../shared/error/codes';
import { Peptide } from '../../shared/models/peptide';

const resolvePeptideFromRequest = (req: Request): Promise<Peptide | null> => {
  const { id, seq } = req.query;

  if (id) {
    if (typeof id !== 'string') {
      throw new BadRequestError('You must provide only a single id as query parameter.', ErrorCode.INVALID_QUERY_PROVIDED);
    }

    return getPeptideById(id);
  }

  if (seq) {
    if (typeof seq !== 'string') {
      throw new BadRequestError('You must provide only a single seq as query parameter.', ErrorCode.INVALID_QUERY_PROVIDED);
    }

    return getPeptideBySequence(seq);
  }

  throw new BadRequestError('Either id or seq query parameters must be provided.', ErrorCode.INVALID_QUERY_PROVIDED);
};

export const get = async (req: Request, res: Response) => {
  const peptide = await resolvePeptideFromRequest(req);
  if (!peptide) {
    throw new ResourceNotFoundError('Requested peptide does not exist.', ErrorCode.PEPTIDE_NOT_FOUND);
  }

  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(peptide);

  res.status(response.code).send(response.build());
};
