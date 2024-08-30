import { Integer } from 'neo4j-driver';
import { GraphDatabaseService } from '../../../../shared/services/neo4j/GraphDatabaseService';
import { createAlphabet } from '../../../../shared/utils/array';
import { FrequencyFilterType } from './getAminoAcidFrequency.model';

export const getTotalAminoAcidFrequency = async (): Promise<Record<string, number>> => {
  const db = GraphDatabaseService.getInstance();
  const query = "MATCH (n:Peptide) WITH apoc.text.join(COLLECT(n.seq), '') AS seqText WITH apoc.coll.frequenciesAsMap(SPLIT(seqText, '')) AS freq RETURN freq";
  const result = await db.query(query);
  const resultObject: Record<string, Integer> = result.records[0]?.get('freq') ?? {};

  return Object.fromEntries(createAlphabet().map((letter) => {
    return [letter, resultObject[letter]?.toInt() ?? 0];
  }));
};

export const getFilteredAminoAcidFrequency = async (type: FrequencyFilterType, filter: string): Promise<Record<string, number>> => {
  const db = GraphDatabaseService.getInstance();
  // We can interpolate the type into the query because it has been validated prior.
  const query = `MATCH (n:Peptide)-[]-(v: ${type}) WHERE v.name = $filter WITH apoc.text.join(COLLECT(n.seq), '') AS seqText WITH apoc.coll.frequenciesAsMap(SPLIT(seqText, '')) AS freq RETURN freq`;
  const result = await db.query(query, { filter });
  const resultObject: Record<string, Integer> = result.records[0]?.get('freq') ?? {};

  return Object.fromEntries(createAlphabet().map((letter) => {
    return [letter, resultObject[letter]?.toInt() ?? 0];
  }));
};
