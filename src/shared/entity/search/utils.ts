import { FiltersObject, SequenceLengthFilter, TextQueryAttributeFilter, TextQueryMetadataFilter } from './models';
import { sanitizeInput } from '../../services/neo4j/query';

const parseSearchSequenceLengthFilter = (filter?: SequenceLengthFilter): string => {
  if (!filter) {
    return '';
  }

  const [min, max] = filter;

  // All options inside the filter object are already validated prior to calling this function.
  return `AND ${min} <= SIZE(n.seq) AND SIZE(n.seq) <= ${max}`;
};

const parseSearchAttributeFilters = (filters?: TextQueryAttributeFilter[]): string => {
  if (!filters || !filters.length) {
    return '';
  }

  // All options inside the filter object are already validated prior to calling this function.
  return filters.reduce((text, [operator, attributeName, comparator, filterValue]) => {
    return text.concat(`${operator} v.${attributeName} ${comparator} ${filterValue} `); // Last white space is important.
  }, '');
};

const parseSearchMetadataFilters = (filters?: TextQueryMetadataFilter[]): string => {
  if (!filters || !filters.length) {
    return '';
  }

  // FilterOperator, MetadataLabel, and FilterComparator are already validated prior to calling this function.
  return filters.reduce((text, [operator, metadataLabel, comparator, filterValue]) => {
    const operatorText = comparator.startsWith('NOT') ? `${operator} NOT` : operator;

    return text.concat(`${operatorText} (n)-[]->(:${metadataLabel} {name: "${sanitizeInput(filterValue)}" }) `); // Last white space is important.
  }, '');
};

export const parseSanitizedFilter = (filters?: FiltersObject): string => {
  const sanitizedLengthFilter = parseSearchSequenceLengthFilter(filters?.length);
  const sanitizedAttributeFilter = parseSearchAttributeFilters(filters?.attributes);
  const sanitizedMetadataFilter = parseSearchMetadataFilters(filters?.metadata);

  return `${sanitizedLengthFilter} ${sanitizedAttributeFilter} ${sanitizedMetadataFilter}`;
};
