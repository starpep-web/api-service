import { MetadataLabel } from '../../shared/entity/peptide/models';

const VALID_NODE_LABELS = ['Origin', 'Target', 'CrossRef', 'Database', 'Function', 'Cterminus', 'Nterminus', 'UnusualAA'];

export const isLabelMetadataLabel = (label: unknown): label is MetadataLabel => {
  return VALID_NODE_LABELS.includes(label as string);
};
