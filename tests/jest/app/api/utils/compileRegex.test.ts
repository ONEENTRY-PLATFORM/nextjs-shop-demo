import { describe, expect, it } from '@jest/globals';

import { compileRegex } from '@/app/api/utils/compileRegex';

describe('compileRegex — mask tokens', () => {
  it('"9" matches a single digit', () => {
    const re = compileRegex('9');
    expect(re.test('5')).toBe(true);
    expect(re.test('a')).toBe(false);
  });

  it('"A" matches a single uppercase letter', () => {
    const re = compileRegex('A');
    expect(re.test('Z')).toBe(true);
    expect(re.test('z')).toBe(false);
    expect(re.test('5')).toBe(false);
  });

  it('"a" matches a single lowercase letter', () => {
    const re = compileRegex('a');
    expect(re.test('q')).toBe(true);
    expect(re.test('Q')).toBe(false);
  });

  it('"*" matches a single alphanumeric character', () => {
    const re = compileRegex('*');
    expect(re.test('5')).toBe(true);
    expect(re.test('A')).toBe(true);
    expect(re.test('z')).toBe(true);
    expect(re.test('-')).toBe(false);
  });

  it('"$" matches a single punctuation character `()-+`', () => {
    const re = compileRegex('$');
    expect(re.test('(')).toBe(true);
    expect(re.test(')')).toBe(true);
    expect(re.test('-')).toBe(true);
    expect(re.test('+')).toBe(true);
    expect(re.test('5')).toBe(false);
  });

  it('"[[space]]" matches whitespace', () => {
    const re = compileRegex('[[space]]');
    expect(re.test(' ')).toBe(true);
    expect(re.test('a')).toBe(false);
  });
});

describe('compileRegex — composite masks', () => {
  it('matches "$9 999 999 9999" (international phone style)', () => {
    const re = compileRegex('$9[[space]]999[[space]]999[[space]]9999');
    expect(re.test('+1 415 555 2671')).toBe(true);
    expect(re.test('+1-415-555-2671')).toBe(false); // requires literal spaces
  });

  it('anchors the pattern (full-string match only)', () => {
    const re = compileRegex('9');
    expect(re.test('123')).toBe(false); // not anchored would match '1'
  });

  it('combines digit + lower + punctuation', () => {
    const re = compileRegex('9a$');
    expect(re.test('1a-')).toBe(true);
    expect(re.test('1A-')).toBe(false);
  });

  it('literal characters in the mask must appear verbatim', () => {
    const re = compileRegex('id:9999');
    expect(re.test('id:1234')).toBe(true);
    expect(re.test('id:12')).toBe(false);
    expect(re.test('ID:1234')).toBe(false);
  });

  it('empty mask matches only empty string', () => {
    const re = compileRegex('');
    expect(re.test('')).toBe(true);
    expect(re.test('x')).toBe(false);
  });

  it('"AAA" rejects partial uppercase / spaces', () => {
    const re = compileRegex('AAA');
    expect(re.test('ABC')).toBe(true);
    expect(re.test('AB')).toBe(false);
    expect(re.test('A C')).toBe(false);
  });

  it('mixes alnum "*" with literal "/"', () => {
    // E.g. "AB/12cd" — literal slash, no token clash.
    const re = compileRegex('**/**');
    expect(re.test('aA/9Z')).toBe(true);
    expect(re.test('aA-9Z')).toBe(false);
  });

  it('"[[space]]" only matches a single whitespace character', () => {
    const re = compileRegex('9[[space]]9');
    expect(re.test('1 2')).toBe(true);
    // Two spaces — no match (single \s).
    expect(re.test('1  2')).toBe(false);
    // Tab — \s also matches \t.
    expect(re.test('1\t2')).toBe(true);
  });

  it('"$" matches each of () - + individually but not other punctuation', () => {
    const re = compileRegex('$');
    expect(re.test('.')).toBe(false);
    expect(re.test('_')).toBe(false);
    expect(re.test(',')).toBe(false);
  });

  it('long composite phone-like mask', () => {
    // "+ (123) 456-7890" — leading $ for '+', then literal " (", then 3 digits, ") ", 3 digits, "-", 4 digits.
    const re = compileRegex('$[[space]]$999$[[space]]999$9999');
    expect(re.test('+ (123) 456-7890')).toBe(true);
    expect(re.test('  123  456 7890')).toBe(false);
  });
});
