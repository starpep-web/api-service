import { createAlphabet, partitionArray } from './array';

describe('Utils: Array', () => {
  describe('createAlphabet()', () => {
    it('should return an array with all uppercase letters.', () => {
      const alphabet = createAlphabet();

      expect(alphabet).toHaveLength(26);
      expect(alphabet).toContain('A');
      expect(alphabet).toContain('M');
      expect(alphabet).toContain('Z');
    });
  });

  describe('partitionArray()', () => {
    it('should return an array with partitioned arrays inside.', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const expected = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10]
      ];

      expect(partitionArray(arr, 3)).toStrictEqual(expected);
    });
  });
});
