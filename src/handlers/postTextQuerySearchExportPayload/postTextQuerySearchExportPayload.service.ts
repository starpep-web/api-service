import { QueryResult, Integer } from 'neo4j-driver';
import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { FiltersObject } from '../../shared/entity/search/models';
import { parseSanitizedFilter } from '../../shared/entity/search/utils';
import { BitArray, ExportPayloadData } from '../../shared/entity/export/models';
import { bitArrayToBase64 } from '../../shared/entity/export/utils';

const mapQueryResult = (result: QueryResult): ExportPayloadData => {
  const [record] = result.records;
  const matchedIds: Integer[] = record.get('ids');

  // Caveat: The use of ID(n) depends on there being 45120 peptides since other nodes will have identifiers that start with 45120 and higher.
  // Note: If new peptides are added, the ID should probably inside the node as a property instead of relying on the Neo4j ID.
  const totalPeptides = 45120;

  const matchedIdBitArray: BitArray = new Array(totalPeptides).fill(0);
  matchedIds.forEach((id) => {
    const index = id.toInt();
    matchedIdBitArray[index] = 1;
  });

  return bitArrayToBase64(matchedIdBitArray);
};

export const exportPayloadDataForPeptidesTextQuery = async (sequence: string, filters?: FiltersObject): Promise<ExportPayloadData> => {
  const db = GraphDatabaseService.getInstance();
  const sanitizedFilter = parseSanitizedFilter(filters);
  const query = `
MATCH (n:Peptide)-[]->(v:Attributes)
WHERE n.seq CONTAINS $sequence ${sanitizedFilter}
WITH DISTINCT(n) AS n
WITH ID(n) AS id
RETURN COLLECT(id) AS ids
`;
  const result = await db.query(query, { sequence: sequence.toUpperCase() });

  return mapQueryResult(result);
};

export const exportPayloadDataForPeptidesRegexQuery = async (regex: string, filters?: FiltersObject): Promise<ExportPayloadData> => {
  const db = GraphDatabaseService.getInstance();
  const sanitizedFilter = parseSanitizedFilter(filters);
  const query = `
MATCH (n:Peptide)-[]->(v:Attributes)
WHERE n.seq =~ $regex ${sanitizedFilter}
WITH DISTINCT(n) AS n
WITH ID(n) AS id
RETURN COLLECT(id) AS ids
`;
  const result = await db.query(query, { regex });

  return mapQueryResult(result);
};
