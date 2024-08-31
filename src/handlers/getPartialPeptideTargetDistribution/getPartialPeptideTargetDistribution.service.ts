import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { PartialRelationStatistics } from '../../shared/entity/statistics/models';

export const getPartialPeptideTargetDistribution = async (limit: number): Promise<PartialRelationStatistics> => {
  const db = GraphDatabaseService.getInstance();
  const query = `
MATCH (n:Peptide)-[r:assessed_against]->(v)
WITH v.name AS target, COUNT(*) AS frequency
WITH COLLECT({\`target\`: target, \`freq\`: frequency}) as aggregate, SUM(frequency) AS total
UNWIND aggregate AS agg
WITH agg.target AS target, agg.freq AS frequency, total
RETURN target, frequency, total, toFloat(frequency) / total AS percentage
ORDER BY frequency DESC
LIMIT $limit
  `;
  const result = await db.query(query, { limit });

  const distribution = Object.fromEntries(result.records.map((record) => {
    const target = record.get('target');
    const frequency = record.get('frequency').toInt();

    return [target, frequency];
  }));
  const percentage = Object.fromEntries(result.records.map((record) => {
    const target = record.get('target');
    const percentage = record.get('percentage');

    return [target, percentage];
  }));
  const total = result.records[0]?.get('total').toInt() ?? 0;

  return {
    distribution,
    percentage,
    total,
    partialSize: Object.keys(distribution).length
  };
};
