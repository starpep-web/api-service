import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ResponseBuilder } from '../../shared/helpers/http/response';
import { resolvePaginationRequest } from '../../shared/utils/pagination';
import { getMetadataSuggestionsPaginated } from './getMetadataSuggestions.service';
import { isLabelMetadataLabel } from './getMetadataSuggestions.model';
import { BadRequestError } from '../../shared/helpers/http/error';
import { ErrorCode } from '../../shared/error/codes';

export const get = async (req: Request, res: Response) => {
  const paginationRequest = resolvePaginationRequest(req, 100);
  const { label, query } = req.query;

  if (!isLabelMetadataLabel(label)) {
    throw new BadRequestError('Invalid label provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }
  if (typeof query !== 'string') {
    throw new BadRequestError('A single query parameter must be provided.', ErrorCode.INVALID_QUERY_PROVIDED);
  }

  const suggestions = await getMetadataSuggestionsPaginated(paginationRequest, label, query);

  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(suggestions);

  res.status(response.code).send(response.build());
};
