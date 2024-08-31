import { NODE_LABELS, MetadataLabel, PeptideAttributes } from '../peptide/models';

const FILTER_SEPARATOR = ';';

const SUPPORTED_OPERATORS = ['AND', 'OR', 'XOR'] as const;
export type FilterOperator = typeof SUPPORTED_OPERATORS[number];

const SUPPORTED_METADATA_COMPARATORS = ['EQUALS', 'NOT_EQUALS'] as const;
export type MetadataFilterComparator = typeof SUPPORTED_METADATA_COMPARATORS[number];

const SUPPORTED_ATTRIBUTE_COMPARATORS = ['<', '<=', '>', '>='] as const;
export type AttributeFilterComparator = typeof SUPPORTED_ATTRIBUTE_COMPARATORS[number];

export type TextQueryMetadataFilter = [FilterOperator, MetadataLabel, MetadataFilterComparator, string];
export type TextQueryAttributeFilter = [FilterOperator, PeptideAttributes.RawAttributeName, AttributeFilterComparator, number];
export type SequenceLengthFilter = [number, number];

export type FiltersObject = {
  metadata?: TextQueryMetadataFilter[]
  attributes?: TextQueryAttributeFilter[]
  length?: SequenceLengthFilter
};

export type TextQueryRequestPayload = {
  sequence?: string
  regex?: string
  metadata?: string[]
  attributes?: string[]
  length?: string
};

export const parseParamToMetadataFilter = (filterParam: string): TextQueryMetadataFilter | undefined => {
  const arr = filterParam.split(FILTER_SEPARATOR);

  if (
    arr.length !== 4 ||
    !SUPPORTED_OPERATORS.includes(arr[0] as FilterOperator) ||
    (!NODE_LABELS.includes(arr[1] as MetadataLabel) && arr[1] !== 'Peptide' && arr[1] !== 'Attributes') ||
    !SUPPORTED_METADATA_COMPARATORS.includes(arr[2] as MetadataFilterComparator)
  ) {
    return undefined;
  }

  return arr as TextQueryMetadataFilter;
};

export const parseParamToAttributeFilter = (filterParam: string): TextQueryAttributeFilter | undefined => {
  const arr = filterParam.split(FILTER_SEPARATOR);

  if (arr.length !== 4) {
    return undefined;
  }

  const filterValue = parseFloat(arr[3]);

  if (
    !SUPPORTED_OPERATORS.includes(arr[0] as FilterOperator) ||
    !PeptideAttributes.isRawAttributeNameValid(arr[1]) ||
    !SUPPORTED_ATTRIBUTE_COMPARATORS.includes(arr[2] as AttributeFilterComparator) ||
    Number.isNaN(filterValue)
  ) {
    return undefined;
  }

  return [arr[0], arr[1], arr[2], filterValue] as TextQueryAttributeFilter;
};

export const parseParamToSequenceLengthFilter = (filterParam: string): SequenceLengthFilter | undefined => {
  const arr = filterParam.split(FILTER_SEPARATOR);

  if (arr.length !== 2) {
    return undefined;
  }

  const min = parseInt(arr[0], 10);
  const max = parseInt(arr[1], 10);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return undefined;
  }

  return [min, max];
};
