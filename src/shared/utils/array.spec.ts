import { createAlphabet } from './array';

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
});
