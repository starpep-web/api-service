import { GraphDatabaseService } from '../../../shared/services/neo4j/GraphDatabaseService';

export const getPeptideCount = async (): Promise<number> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide) RETURN COUNT(n) AS c';
  const result = await db.query(query);

  return result.records[0]?.get('c').toInt() ?? 0;
};
