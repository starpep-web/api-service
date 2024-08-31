export const createAlphabet = (): string[] => {
  const A_ASCII_CODE = 65;
  const ALPHABET_SIZE = 26;

  return new Array(ALPHABET_SIZE)
    .fill(null)
    .map((_, idx) => String.fromCharCode(A_ASCII_CODE + idx));
};

export const partitionArray = <T>(arr: T[], size: number): T[][] => {
  const partitioned: T[][] = new Array(Math.ceil(arr.length / size)).fill(null);

  let k = 0;
  for (let i = 0; i < arr.length; i += size) {
    partitioned[k] = arr.slice(i, i + size);
    k++;
  }

  return partitioned;
};
