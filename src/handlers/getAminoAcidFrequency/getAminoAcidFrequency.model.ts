const FREQUENCY_FILTER_TYPES = ['Database', 'Function', 'Origin'] as const;
export type FrequencyFilterType = typeof FREQUENCY_FILTER_TYPES[number];

export const isFrequencyFilterValid = (filter: unknown): filter is FrequencyFilterType => {
  return FREQUENCY_FILTER_TYPES.includes(filter as FrequencyFilterType);
};
