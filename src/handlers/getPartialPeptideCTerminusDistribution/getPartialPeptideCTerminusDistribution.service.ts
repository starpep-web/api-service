import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { PartialRelationStatistics } from '../../shared/entity/statistics/models';

export const getPartialPeptideCTerminusDistribution = async (limit: number): Promise<PartialRelationStatistics> => {
  const db = GraphDatabaseService.getInstance();
  const query = `
MATCH (n:Peptide)-[r:modified_by]->(v:Cterminus)
WITH v.name AS cModifier, COUNT(*) AS frequency
WITH COLLECT({\`cModifier\`: cModifier, \`freq\`: frequency}) as aggregate, SUM(frequency) AS total
UNWIND aggregate AS agg
WITH agg.cModifier AS cModifier, agg.freq AS frequency, total
RETURN cModifier, frequency, total, toFloat(frequency) / total AS percentage
ORDER BY frequency DESC
LIMIT $limit
  `;
  const result = await db.query(query, { limit });

  const distribution = Object.fromEntries(result.records.map((record) => {
    const cModifier = record.get('cModifier');
    const frequency = record.get('frequency').toInt();

    return [cModifier, frequency];
  }));
  const percentage = Object.fromEntries(result.records.map((record) => {
    const cModifier = record.get('cModifier');
    const percentage = record.get('percentage');

    return [cModifier, percentage];
  }));
  const total = result.records[0]?.get('total').toInt() ?? 0;

  return {
    distribution,
    percentage,
    total,
    partialSize: Object.keys(distribution).length
  };
};
