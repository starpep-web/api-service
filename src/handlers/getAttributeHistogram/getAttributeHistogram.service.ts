import { Integer } from 'neo4j-driver';
import { GraphDatabaseService } from '../../shared/services/neo4j/GraphDatabaseService';
import { formatNumberDecimals } from '../../shared/utils/number';
import { HistogramWidthMethod, HistogramData } from './getAttributeHistogram.model';
import { PeptideAttributes } from '../../shared/entity/peptide/models';

// Interpolation in query should be fine since attributeName is already validated prior.
const generateHistogramQueryForAttribute = (attributeName: PeptideAttributes.RawAttributeName, widthMethod: HistogramWidthMethod): string => {
  const dependencyQuery = widthMethod === 'scott' ?
    'stDev(a) AS s' :
    'percentileCont(a, 0.75) AS q3, percentileCont(a, 0.25) AS q1';
  const widthQuery = widthMethod === 'scott' ?
    '3.49 * s * n^(-1.0/3)' :
    '2 * (q3 - q1) * n^(-1.0/3)';

  return `
MATCH (m:Attributes)
WITH m.${attributeName} AS a
WITH MIN(a) AS min, MAX(a) AS max, COUNT(a) AS n, ${dependencyQuery}
WITH min, max, n, max - min AS r, ${widthQuery} AS w
WITH min, max, n, r, w, toInteger(round(r / w)) AS k
MATCH (m:Attributes)
WITH m.${attributeName} AS a, min, max, n, r, w, k
WITH min, max, w, k, toInteger(round((a - min) / w)) AS kn, COUNT(*) AS f ORDER BY kn
RETURN toFloat(min) as min, toFloat(max) as max, toFloat(w) AS width, k AS numOfBins, COLLECT({ classNum: kn, frequency: f }) AS bins
  `;
};

const computeHistogramDataForAttribute = async (attributeName: PeptideAttributes.RawAttributeName, widthMethod: HistogramWidthMethod = 'scott'): Promise<HistogramData> => {
  const db = GraphDatabaseService.getInstance();
  const query = generateHistogramQueryForAttribute(attributeName, widthMethod);
  const result = await db.query(query);
  const [record] = result.records;

  return {
    min: record.get('min'),
    max: record.get('max'),
    width: record.get('width'),
    numOfBins: record.get('numOfBins').toInt(),
    bins: record.get('bins').map((bin: { classNum: Integer, frequency: Integer }) => ({
      classNum: bin.classNum.toInt(),
      frequency: bin.frequency.toInt()
    }))
  };
};

const mapHistogramData = (data: HistogramData, binMaxDigits: number): Record<string, number> => {
  const histogram: Record<string, number> = {};

  for (let i = 0; i < data.numOfBins; i++) {
    const start = formatNumberDecimals(data.min + (data.width * i), binMaxDigits);
    const end = formatNumberDecimals(data.min + (data.width * (i + 1)), binMaxDigits);
    const key = `${start}; ${end}`;

    histogram[key] = data.bins.find((bin) => bin.classNum === i)?.frequency ?? 0;
  }

  return histogram;
};

export const getAttributeHistogram = async (attributeName: PeptideAttributes.RawAttributeName, widthMethod?: HistogramWidthMethod): Promise<Record<string, number>> => {
  return mapHistogramData(await computeHistogramDataForAttribute(attributeName, widthMethod), 3);
};
