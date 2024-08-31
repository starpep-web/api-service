import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';

export const getUnusualPeptideCount = async (): Promise<number> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide)-[r:constituted_by]->(v) RETURN COUNT(v) AS c';
  const result = await db.query(query);

  return result.records[0]?.get('c').toInt() ?? -1;
};
