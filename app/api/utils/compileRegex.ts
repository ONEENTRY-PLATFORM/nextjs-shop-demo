function maskToRegex(mask: string) {
  const maskRules: { [key: string]: string } = {
    '\\[\\[space\\]\\]': '\\s',
    '\\$': '[\\(\\)\\-\\+]',
    '9': '\\d',
    A: '[A-Z]',
    a: '[a-z]',
    '\\*': '[\\dA-Za-z]',
  };

  let regexPattern = mask.toString();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in maskRules) {
    const regex = new RegExp(key, 'g');
    const replacement = maskRules[key];
    if (replacement !== undefined) {
      regexPattern = regexPattern.replace(regex, replacement);
    }
  }
  return regexPattern;
}

export function compileRegex(mask: string) {
  const regexPattern = maskToRegex(mask);
  return new RegExp(`^${regexPattern}$`);
}
