import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { PartialRelationStatistics } from '../../shared/models/statistics';

export const getPartialPeptideNTerminusDistribution = async (limit: number): Promise<PartialRelationStatistics> => {
  const db = GraphDatabaseService.getInstance();
  const query = `
MATCH (n:Peptide)-[r:modified_by]->(v:Nterminus)
WITH v.name AS nModifier, COUNT(*) AS frequency
WITH COLLECT({\`nModifier\`: nModifier, \`freq\`: frequency}) as aggregate, SUM(frequency) AS total
UNWIND aggregate AS agg
WITH agg.nModifier AS nModifier, agg.freq AS frequency, total
RETURN nModifier, frequency, total, toFloat(frequency) / total AS percentage
ORDER BY frequency DESC
LIMIT $limit
  `;
  const result = await db.query(query, { limit });

  const distribution = Object.fromEntries(result.records.map((record) => {
    const nModifier = record.get('nModifier');
    const frequency = record.get('frequency').toInt();

    return [nModifier, frequency];
  }));
  const percentage = Object.fromEntries(result.records.map((record) => {
    const nModifier = record.get('nModifier');
    const percentage = record.get('percentage');

    return [nModifier, percentage];
  }));
  const total = result.records[0]?.get('total').toInt() ?? 0;

  return {
    distribution,
    percentage,
    total,
    partialSize: Object.keys(distribution).length
  };
};
