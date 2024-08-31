import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { createPagination, PaginationRequest, WithPagination } from '../../shared/utils/pagination';
import { MetadataLabel } from '../../shared/entity/peptide/models';

const getMetadataSuggestions = async (nodeLabel: MetadataLabel, name: string, limit: number, skip: number): Promise<string[]> => {
  const db = GraphDatabaseService.getInstance();
  // We can interpolate the nodeLabel because this is validated prior.
  const query = `MATCH (p:Peptide)-[]-(n:${nodeLabel}) WHERE toLower(n.name) STARTS WITH toLower($name) RETURN DISTINCT(n.name) AS name ORDER BY name ASC SKIP $skip LIMIT $limit`;
  const result = await db.query(query, { name, limit, skip });

  return result.records.map((record) => {
    return record.get('name');
  });
};

export const getMetadataSuggestionsPaginated = async (paginationRequest: PaginationRequest, nodeLabel: MetadataLabel, name: string): Promise<WithPagination<string>> => {
  const db = GraphDatabaseService.getInstance();
  // We can interpolate the nodeLabel because this is validated prior.
  const query = `MATCH (n:${nodeLabel}) WHERE toLower(n.name) STARTS WITH toLower($name) RETURN COUNT(DISTINCT(n)) AS c`;
  const result = await db.query(query, { name });
  const total = result.records[0]?.get('c').toInt() ?? 0;

  const pagination = createPagination(paginationRequest.start, total, paginationRequest.limit);
  return {
    data: await getMetadataSuggestions(nodeLabel, name, paginationRequest.limit, paginationRequest.start),
    pagination
  };
};
