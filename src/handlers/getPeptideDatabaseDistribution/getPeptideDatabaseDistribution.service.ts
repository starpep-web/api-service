import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';

export const getPeptideDatabaseDistribution = async (): Promise<Record<string, number>> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide)-[r:compiled_in]->(v) RETURN v.name AS database, COUNT(*) AS frequency ORDER BY database ASC';
  const result = await db.query(query);

  return Object.fromEntries(result.records.map((record) => {
    const database = record.get('database');
    const frequency = record.get('frequency').toInt();

    return [database, frequency];
  }));
};
