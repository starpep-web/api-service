import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ResponseBuilder } from '../../shared/helpers/http/response';
import { resolvePaginationRequest } from '../../shared/utils/pagination';
import { validateWithSchema } from '../../shared/utils/schema';
import { TextQuerySchema } from '../../shared/entity/search/schemas';
import { searchPeptidesTextQueryPaginated, searchPeptidesRegexQueryPaginated } from './postTextQuerySearch.service';
import {
  parseParamToAttributeFilter,
  parseParamToMetadataFilter,
  parseParamToSequenceLengthFilter,
  TextQueryAttributeFilter,
  TextQueryMetadataFilter
} from '../../shared/entity/search/models';

export const post = async (req: Request, res: Response) => {
  const paginationRequest = resolvePaginationRequest(req, 50);
  const payload = validateWithSchema(req.body, TextQuerySchema);
  const filters = {
    metadata: payload.metadata?.map((param) => parseParamToMetadataFilter(param))
      .filter((filter): filter is TextQueryMetadataFilter => typeof filter !== 'undefined'),
    attributes: payload.attributes?.map((param) => parseParamToAttributeFilter(param))
      .filter((filter): filter is TextQueryAttributeFilter => typeof filter !== 'undefined'),
    length: payload.length ? parseParamToSequenceLengthFilter(payload.length) : undefined
  };

  const peptides = typeof payload.sequence !== 'undefined' ?
    await searchPeptidesTextQueryPaginated(paginationRequest, payload.sequence, filters) :
    await searchPeptidesRegexQueryPaginated(paginationRequest, payload.regex!, filters);

  const response = new ResponseBuilder()
    .withStatusCode(HttpStatus.OK)
    .withData(peptides);

  res.status(response.code).send(response.build());
};
