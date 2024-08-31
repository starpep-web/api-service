import { int, QueryResult } from 'neo4j-driver';
import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { PeptideAttributes, Peptide, PeptideMetadata, RawRelationshipLabel, MetadataRelationshipLabel, getRelationshipLabelFromRaw, getPeptideId, extractPeptideIdentityFromId } from '../../shared/entity/peptide/models';

const mapSearchPeptideAttributes = (properties: PeptideAttributes.Neo4jProperties): PeptideAttributes.SearchAttributes => {
  return {
    hydropathicity: properties.hydropathicity,
    charge: properties.charge.toInt(),
    isoelectricPoint: properties.isoelectric_point,
    bomanIndex: properties.boman_index,
    gaacAlphatic: properties.gaac_alphatic,
    gaacAromatic: properties.gaac_aromatic,
    gaacPositiveCharge: properties.gaac_positive_charge,
    gaacNegativeCharge: properties.gaac_negative_charge,
    gaacUncharge: properties.gaac_uncharge
  };
};

const mapFullPeptideAttributes = (properties: PeptideAttributes.Neo4jProperties): PeptideAttributes.FullAttributes => {
  return {
    ...mapSearchPeptideAttributes(properties),
    hydrophobicity: properties.hydrophobicity,
    solvation: properties.solvation,
    amphiphilicity: properties.amphiphilicity,
    hydrophilicity: properties.hydrophilicity,
    hemolyticProbScore: properties.hemolytic_prob_score,
    stericHindrance: properties.steric_hindrance,
    netHydrogen: properties.net_hydrogen.toInt(),
    molWt: properties.mol_wt,
    aliphaticIndex: properties.aliphatic_index
  };
};

const mapPeptideFromQueryResult = (result: QueryResult): Peptide | null => {
  const [firstRecord] = result.records;
  if (!firstRecord) {
    return null;
  }

  const peptideNode = firstRecord.get('n');
  const [metadata, attributes]: [PeptideMetadata, PeptideAttributes.FullAttributes] = result.records.reduce((peptideData, record) => {
    const rawRelationship: RawRelationshipLabel = record.get('r').type;

    if (rawRelationship === 'characterized_by') {
      peptideData[1] = mapFullPeptideAttributes(record.get('v').properties);
    } else {
      const peptideDataObject = peptideData[0];
      const relationship = getRelationshipLabelFromRaw(rawRelationship) as MetadataRelationshipLabel;
      const value = record.get('v').properties.name;

      if (!peptideDataObject[relationship]) {
        peptideDataObject[relationship] = [value];
      } else {
        peptideDataObject[relationship]!.push(value);
      }
    }

    return peptideData;
  }, [{}, {}] as [PeptideMetadata, PeptideAttributes.FullAttributes]);

  return {
    id: getPeptideId(peptideNode.identity.toInt()),
    sequence: peptideNode.properties.seq,
    length: peptideNode.properties.seq.length,
    metadata,
    attributes
  };
};

export const getPeptideById = async (id: string): Promise<Peptide | null> => {
  const identity = extractPeptideIdentityFromId(id);
  if (!identity) {
    return null;
  }

  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide)-[r]->(v) WHERE ID(n) = $id RETURN n, r, v';
  const result = await db.query(query, { id: int(identity) });

  return mapPeptideFromQueryResult(result);
};

export const getPeptideBySequence = async (sequence: string): Promise<Peptide | null> => {
  const db = GraphDatabaseService.getInstance();
  const query = 'MATCH (n:Peptide {seq: $sequence})-[r]->(v) RETURN n, r, v';
  const result = await db.query(query, { sequence: sequence.toUpperCase() });

  return mapPeptideFromQueryResult(result);
};
