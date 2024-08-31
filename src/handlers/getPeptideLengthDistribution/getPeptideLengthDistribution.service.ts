import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';

export const getPeptideLengthDistribution = async (): Promise<Record<number, number>> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide) RETURN SIZE(n.seq) AS length, COUNT(*) as frequency ORDER BY length DESC';
  const result = await db.query(query);

  return Object.fromEntries(result.records.map((record) => {
    const length = record.get('length').toInt();
    const frequency = record.get('frequency').toInt();

    return [length, frequency];
  }));
};
