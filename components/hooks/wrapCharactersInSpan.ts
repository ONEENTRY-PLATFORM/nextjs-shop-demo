/**
 * Wraps each character of a text string in HTML span elements
 * 
 * This function takes a text string and wraps each individual character
 * in a separate HTML span element. This is useful for creating character-level
 * animations or applying individual styling to each character.
 * 
 * @param text - The input text string to process
 * @returns A string with each character wrapped in <span> elements
 * 
 * @example
 * ```typescript
 * const wrapped = wrapCharactersInSpan('Hello');
 * // Returns '<span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>'
 * ```
 */
function wrapCharactersInSpan(text: string): string {
  let result = '';
  for (const char of text) {
    result += `<span>${char}</span>`;
  }
  return result;
}

export default wrapCharactersInSpan;