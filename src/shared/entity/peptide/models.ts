import assert from 'assert';
import { Integer } from 'neo4j-driver';

export const NODE_LABELS = ['Origin', 'Target', 'Peptide', 'CrossRef', 'Database', 'Function', 'Cterminus', 'Nterminus', 'UnusualAA', 'Attributes'] as const;
export type NodeLabel = typeof NODE_LABELS[number];

export const RAW_RELATIONSHIP_LABELS = ['assessed_against', 'compiled_in', 'constituted_by', 'is_a', 'linked_to', 'modified_by', 'produced_by', 'related_to', 'characterized_by'] as const;
export type RawRelationshipLabel = typeof RAW_RELATIONSHIP_LABELS[number];

export const RELATIONSHIP_LABELS = ['assessedAgainst', 'compiledIn', 'constitutedBy', 'isA', 'linkedTo', 'modifiedBy', 'producedBy', 'relatedTo', 'characterizedBy'] as const;
export type RelationshipLabel = typeof RELATIONSHIP_LABELS[number];

export const FRIENDLY_RELATIONSHIP_LABELS = ['Assessed Against', 'Compiled In', 'Constituted By', 'Is A', 'Linked To', 'Modified By', 'Produced By', 'Related To', 'Characterized By'] as const;
export type FriendlyRelationshipLabel = typeof FRIENDLY_RELATIONSHIP_LABELS[number];

assert.strictEqual(RAW_RELATIONSHIP_LABELS.length, RELATIONSHIP_LABELS.length); // Ensure both RAW_RELATIONSHIP_LABELS and RELATIONSHIP_LABELS are same size.
assert.strictEqual(RAW_RELATIONSHIP_LABELS.length, FRIENDLY_RELATIONSHIP_LABELS.length); // Ensure both RAW_RELATIONSHIP_LABELS and FRIENDLY_RELATIONSHIP_LABELS are same size.

export const RELATIONSHIP_LABEL_MAP = RAW_RELATIONSHIP_LABELS.reduce((acc, raw, idx) => {
  return {
    ...acc,
    [raw]: RELATIONSHIP_LABELS[idx]
  };
}, {} as Record<RawRelationshipLabel, RelationshipLabel>);
export const getRelationshipLabelFromRaw = (relationship: RawRelationshipLabel): RelationshipLabel => {
  return RELATIONSHIP_LABEL_MAP[relationship];
};

export type MetadataLabel = Exclude<NodeLabel, 'Peptide' | 'Attributes'>;
export type MetadataRelationshipLabel = Exclude<RelationshipLabel, 'characterizedBy'>;

export type BasePeptide = {
  id: string
  sequence: string
  length: number
};

export type PeptideMetadata = Partial<Record<MetadataRelationshipLabel, string[]>>;

export namespace PeptideAttributes {
  const RAW_ATTRIBUTE_TO_REAL_ATTRIBUTE_MAP = {
    hydropathicity: 'hydropathicity',
    charge: 'charge',
    isoelectric_point: 'isoelectricPoint',
    boman_index: 'bomanIndex',
    gaac_alphatic: 'gaacAlphatic',
    gaac_aromatic: 'gaacAromatic',
    gaac_positive_charge: 'gaacPositiveCharge',
    gaac_negative_charge: 'gaacNegativeCharge',
    gaac_uncharge: 'gaacUncharge',
    hydrophobicity: 'hydrophobicity',
    solvation: 'solvation',
    amphiphilicity: 'amphiphilicity',
    hydrophilicity: 'hydrophilicity',
    hemolytic_prob_score: 'hemolyticProbScore',
    steric_hindrance: 'stericHindrance',
    net_hydrogen: 'netHydrogen',
    mol_wt: 'molWt',
    aliphatic_index: 'aliphaticIndex'
  } as const;
  export type RawAttributeName = keyof typeof RAW_ATTRIBUTE_TO_REAL_ATTRIBUTE_MAP;

  export type Neo4jProperties = Record<RawAttributeName, number> & {
    charge: Integer
    net_hydrogen: Integer
  };

  export type SearchAttributes = {
    hydropathicity: number
    charge: number
    isoelectricPoint: number
    bomanIndex: number
    gaacAlphatic: number
    gaacAromatic: number
    gaacPositiveCharge: number
    gaacNegativeCharge: number
    gaacUncharge: number
  };

  export type StatisticalAttributes = SearchAttributes & {
    hydrophobicity: number
    solvation: number
    amphiphilicity: number
    hydrophilicity: number
  };

  export type OtherAttributes = {
    hemolyticProbScore: number
    stericHindrance: number
    netHydrogen: number
    molWt: number
    aliphaticIndex: number
  }

  export type FullAttributes = StatisticalAttributes & OtherAttributes;
  export type AttributeName = keyof FullAttributes

  export const isRawAttributeNameValid = (attribute: unknown): attribute is RawAttributeName => {
    return Object.keys(RAW_ATTRIBUTE_TO_REAL_ATTRIBUTE_MAP).includes(attribute as RawAttributeName);
  };

  // export const getFriendlyNameForRawAttribute = (attributeName: RawPropertyName): string => {
  //   return REAL_ATTRIBUTE_TO_FRIENDLY_NAME_MAP[RAW_ATTRIBUTE_TO_REAL_ATTRIBUTE_MAP[attributeName]];
  // };
}

export type SearchPeptide = BasePeptide & {
  attributes: PeptideAttributes.SearchAttributes
};

export type Peptide = BasePeptide & {
  metadata: PeptideMetadata
  attributes: PeptideAttributes.FullAttributes
};

export const ID_PREFIX = 'starPep_';
export const ID_LENGTH = 5;

export const getPeptideId = (identifier: number) => {
  const formattedNumber = identifier.toLocaleString('en-US', {
    minimumIntegerDigits: ID_LENGTH,
    useGrouping: false
  });

  return `${ID_PREFIX}${formattedNumber}`;
};

export const extractPeptideIdentityFromId = (id: string): string | null => {
  const identity = id.slice(ID_PREFIX.length);
  return identity.match(/^\d{5}$/) ? identity : null;
};
