import { sanitizeInput } from './query';

describe('Shared > Services > Neo4j > Query', () => {
  describe('sanitizeInput()', () => {
    it('should return the same input if clean.', () => {
      const input = 'NORMAL QUERY';
      expect(sanitizeInput(input)).toBe(input);
    });

    it('should escape single quotes.', () => {
      const input = `WITH' QUOTES'`;
      const expected = `WITH\\' QUOTES\\'`;
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape unicode single quotes.', () => {
      const input = `WITH\\u0027 QUOTES\\u0027`;
      const expected = `WITH\\\\u0027 QUOTES\\\\u0027`;
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape double quotes.', () => {
      const input = `WITH" QUOTES"`;
      const expected = `WITH\\" QUOTES\\"`;
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape unicode double quotes.', () => {
      const input = `WITH\\u0022 QUOTES\\u0022`;
      const expected = `WITH\\\\u0022 QUOTES\\\\u0022`;
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape backtick quotes.', () => {
      const input = 'WITH` QUOTES`';
      const expected = 'WITH\\` QUOTES\\`';
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape unicode backtick quotes.', () => {
      const input = `WITH\\u0060 QUOTES\\u0060`;
      const expected = `WITH\\\\u0060 QUOTES\\\\u0060`;
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should escape mixed quotes.', () => {
      const input = `WITH" QUOTES' YEP\``;
      const expected = `WITH\\" QUOTES\\' YEP\\\``;
      expect(sanitizeInput(input)).toBe(expected);
    });
  });
});
