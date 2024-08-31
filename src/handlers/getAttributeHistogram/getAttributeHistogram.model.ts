export interface HistogramData {
  min: number
  max: number
  width: number
  numOfBins: number
  bins: {
    classNum: number
    frequency: number
  }[]
}

const histogramWidthMethods = ['scott', 'freedman-diaconis'] as const;
export type HistogramWidthMethod = typeof histogramWidthMethods[number];

export const isHistogramMethodValid = (method: unknown): method is HistogramWidthMethod => {
  return histogramWidthMethods.includes(method as HistogramWidthMethod);
};
