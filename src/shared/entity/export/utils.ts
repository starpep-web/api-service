import { BitArray } from './models';
import { partitionArray } from '../../utils/array';

export const bitArrayToBase64 = (arr: BitArray): string => {
  if (!arr.length) {
    throw new Error('BitArray cannot be empty.');
  }

  const partitionedBytes = partitionArray(arr, 8);

  const byteSizeDifference = arr.length % 4;
  if (byteSizeDifference) {
    const lastPartition = partitionedBytes.at(-1)!;
    for (let i = 0; i < 4 - byteSizeDifference; i++) {
      lastPartition.push(0);
    }
  }

  const charCodes = partitionedBytes.map((byte) => {
    return parseInt(byte.join(''), 2);
  });

  return Buffer.from(charCodes).toString('base64');
};
