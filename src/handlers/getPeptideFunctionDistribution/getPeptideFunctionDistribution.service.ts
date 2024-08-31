import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';

export const getPeptideFunctionDistribution = async (): Promise<Record<string, number>> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide)-[r:related_to]->(v) RETURN v.name AS func, COUNT(*) AS frequency ORDER BY frequency DESC';
  const result = await db.query(query);

  return Object.fromEntries(result.records.map((record) => {
    const func = record.get('func');
    const frequency = record.get('frequency').toInt();

    return [func, frequency];
  }));
};
