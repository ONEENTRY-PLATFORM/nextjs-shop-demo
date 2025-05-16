function wrapCharactersInSpan(text: string): string {
  let result = '';
  for (const char of text) {
    result += `<span>${char}</span>`;
  }
  return result;
}

export default wrapCharactersInSpan;
