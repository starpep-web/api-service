import { GraphDatabaseService } from '../../../../../shared/services/neo4j/GraphDatabaseService';
import { PartialRelationStatistics } from '../../../../../shared/models/statistics';

export const getPartialPeptideOriginDistribution = async (limit: number): Promise<PartialRelationStatistics> => {
  const db = GraphDatabaseService.getInstance();
  const query = `
MATCH (n:Peptide)-[r:produced_by]->(v)
WITH v.name AS origin, COUNT(*) AS frequency
WITH COLLECT({\`origin\`: origin, \`freq\`: frequency}) as aggregate, SUM(frequency) AS total
UNWIND aggregate AS agg
WITH agg.origin AS origin, agg.freq AS frequency, total
RETURN origin, frequency, total, toFloat(frequency) / total AS percentage
ORDER BY frequency DESC
LIMIT $limit
  `;
  const result = await db.query(query, { limit });

  const distribution = Object.fromEntries(result.records.map((record) => {
    const origin = record.get('origin');
    const frequency = record.get('frequency').toInt();

    return [origin, frequency];
  }));
  const percentage = Object.fromEntries(result.records.map((record) => {
    const origin = record.get('origin');
    const percentage = record.get('percentage');

    return [origin, percentage];
  }));
  const total = result.records[0]?.get('total').toInt() ?? 0;

  return {
    distribution,
    percentage,
    total,
    partialSize: Object.keys(distribution).length
  };
};
