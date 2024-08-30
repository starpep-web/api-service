export const createAlphabet = (): string[] => {
  const A_ASCII_CODE = 65;
  const ALPHABET_SIZE = 26;

  return new Array(ALPHABET_SIZE)
    .fill(null)
    .map((_, idx) => String.fromCharCode(A_ASCII_CODE + idx));
};
