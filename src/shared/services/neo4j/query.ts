// According to this: https://neo4j.com/developer/kb/protecting-against-cypher-injection/#_escape_characters_in_cypher
export const sanitizeInput = (input: string): string => {
  return input.replace(/'|\\u0027|"|\\u0022|`|\\u0060/g, (replacement) => {
    return `\\${replacement}`;
  });
};
