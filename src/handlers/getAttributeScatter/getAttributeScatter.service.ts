import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { PeptideAttributes } from '../../shared/entity/peptide/models';
import { Vector2 } from './getAttributeScatter.model';

export const getAttributeScatter = async (xAttributeName: PeptideAttributes.RawAttributeName, yAttributeName: PeptideAttributes.RawAttributeName): Promise<Vector2[]> => {
  const db = GraphDatabaseService.getInstance();
  // It is okay to interpolate the attributes here because they're already validated prior.
  const query = `
MATCH (m:Attributes)
WITH toFloat(m.${xAttributeName}) AS x, toFloat(m.${yAttributeName}) AS y
RETURN COLLECT([x, y]) AS data
`;
  const result = await db.query(query);
  const [record] = result.records;

  return record.get('data');
};
