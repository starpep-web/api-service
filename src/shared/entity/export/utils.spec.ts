import { bitArrayToBase64 } from './utils';
import { BitArray } from './models';

describe('Utils: Export', () => {
  describe('bitArrayToBase64()', () => {
    it('should throw if attempting to convert empty array.', () => {
      expect(() => {
        bitArrayToBase64([]);
      }).toThrow();
    });

    it('should return a base64 string corresponding to the base64 representation of the bit array where resulting string should not have padding characters.', () => {
      const arr: BitArray = [
        0, 1, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 1, 0,
        1, 0, 0, 0, 0, 0, 0, 0
      ];
      const expected = 'aAaA';

      expect(bitArrayToBase64(arr)).toBe(expected);
    });

    it('should return a base64 string corresponding to the base64 representation of the bit array where resulting string should have 1 padding character.', () => {
      const arr: BitArray = [
        1, 1, 0, 0, 1, 1, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 0
      ];
      const expected = 'zMA=';

      expect(bitArrayToBase64(arr)).toBe(expected);
    });

    it('should return a base64 string corresponding to the base64 representation of the bit array where resulting string should have 2 padding characters.', () => {
      const arr: BitArray = [
        0, 1, 1, 0, 1, 0, 0, 0
      ];
      const expected = 'aA==';

      expect(bitArrayToBase64(arr)).toBe(expected);
    });

    it('should return a base64 string corresponding to the base64 representation of the bit array even if arr represents an incomplete byte.', () => {
      const arr: BitArray = [
        0, 1, 1, 0, 1
      ];
      const expected = 'aA==';

      expect(bitArrayToBase64(arr)).toBe(expected);
    });

    it('should return a base64 string corresponding to the base64 representation of the bit array for an absurdly big array.', () => {
      const arr: BitArray = '1'.repeat(45120).split('').map((n) => parseInt(n, 10)) as BitArray;
      const expected = '/'.repeat(7520);

      expect(bitArrayToBase64(arr)).toBe(expected);
    });
  });
});
