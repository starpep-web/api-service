import { QueryResult } from 'neo4j-driver';
import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { createPagination, PaginationRequest, WithPagination } from '../../shared/utils/pagination';
import { getPeptideId, SearchPeptide } from '../../shared/entity/peptide/models';
import { mapSearchPeptideAttributes } from '../../shared/entity/peptide/utils';
import { FiltersObject } from '../../shared/entity/search/models';
import { parseSanitizedFilter } from '../../shared/entity/search/utils';

const mapResult = (result: QueryResult): SearchPeptide[] => {
  return result.records.map((r) => {
    const node = r.get('n');
    const attributes = mapSearchPeptideAttributes(r.get('v').properties);

    return {
      id: getPeptideId(node.identity.toInt()),
      sequence: node.properties.seq,
      length: node.properties.seq.length,
      attributes
    };
  });
};

const searchPeptidesTextQuery = async (sequence: string, limit: number, skip: number, sanitizedFilter: string): Promise<SearchPeptide[]> => {
  const db = GraphDatabaseService.getInstance();
  const query = `MATCH (n:Peptide)-[]->(v:Attributes) WHERE n.seq CONTAINS $sequence ${sanitizedFilter} RETURN DISTINCT(n), v ORDER BY ID(n) ASC SKIP $skip LIMIT $limit`;
  const result = await db.query(query, { sequence: sequence.toUpperCase(), limit, skip });

  return mapResult(result);
};

export const searchPeptidesTextQueryPaginated = async (paginationRequest: PaginationRequest, sequence: string, filters?: FiltersObject): Promise<WithPagination<SearchPeptide>> => {
  const db = GraphDatabaseService.getInstance();
  const sanitizedFilter = parseSanitizedFilter(filters);
  const query = `MATCH (n:Peptide)-[]->(v:Attributes) WHERE n.seq CONTAINS $sequence ${sanitizedFilter} RETURN COUNT(DISTINCT(n)) AS c`;
  const result = await db.query(query, { sequence: sequence.toUpperCase() });
  const total = result.records[0]?.get('c').toInt() ?? 0;

  const pagination = createPagination(paginationRequest.start, total, paginationRequest.limit);
  return {
    data: await searchPeptidesTextQuery(sequence, paginationRequest.limit, paginationRequest.start, sanitizedFilter),
    pagination
  };
};

const searchPeptidesRegexQuery = async (regex: string, limit: number, skip: number, sanitizedFilter: string): Promise<SearchPeptide[]> => {
  const db = GraphDatabaseService.getInstance();
  const query = `MATCH (n:Peptide)-[]->(v:Attributes) WHERE n.seq =~ $regex ${sanitizedFilter} RETURN DISTINCT(n), v ORDER BY ID(n) ASC SKIP $skip LIMIT $limit`;
  const result = await db.query(query, { regex, limit, skip });

  return mapResult(result);
};

export const searchPeptidesRegexQueryPaginated = async (paginationRequest: PaginationRequest, regex: string, filters?: FiltersObject): Promise<WithPagination<SearchPeptide>> => {
  const db = GraphDatabaseService.getInstance();
  const sanitizedFilter = parseSanitizedFilter(filters);
  const query = `MATCH (n:Peptide)-[]->(v:Attributes) WHERE n.seq =~ $regex ${sanitizedFilter} RETURN COUNT(DISTINCT(n)) AS c`;
  const result = await db.query(query, { regex });
  const total = result.records[0]?.get('c').toInt() ?? 0;

  const pagination = createPagination(paginationRequest.start, total, paginationRequest.limit);
  return {
    data: await searchPeptidesRegexQuery(regex, paginationRequest.limit, paginationRequest.start, sanitizedFilter),
    pagination
  };
};
