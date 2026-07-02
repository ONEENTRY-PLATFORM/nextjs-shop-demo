import { describe, expect, it } from '@jest/globals';

import { validators } from '@/app/api/utils/validators';

describe('validators.requiredValidator', () => {
  // The second argument is unused by the implementation but required by the
  // `Validators` type in this project — an empty payload is passed everywhere.
  it('returns false on empty string', () => {
    expect(validators.requiredValidator('', {})).toBe(false);
  });
  it('returns true on non-empty string', () => {
    expect(validators.requiredValidator('x', {})).toBe(true);
  });
  it('returns true on whitespace (this is by design — trim is caller-side)', () => {
    expect(validators.requiredValidator(' ', {})).toBe(true);
  });
});

describe('validators.emailInspectionValidator', () => {
  it.each(['foo@bar.com', 'first.last@example.co.uk', 'a@b.cd'])(
    'accepts %s',
    (email) => {
      expect(validators.emailInspectionValidator(email, {})).toBe(true);
    },
  );

  it.each([
    '',
    'plain',
    'no-at-sign.com',
    '@nolocal.com',
    'spaces in@email.com',
    'trailing.dot@domain.',
  ])('rejects %s', (email) => {
    expect(validators.emailInspectionValidator(email, {})).toBe(false);
  });

  // Known limitation of the current regex `[\w-]+(\.[\w-]+)*@…`: the local part
  // does not allow `+`, so Gmail-style plus-tags (`user+tag@gmail.com`) are
  // rejected. Documented here as a regression guard — if the regex is widened
  // to accept `+`, this test should flip to `.toBe(true)`.
  it('rejects plus-tagged local part (current regex limitation)', () => {
    expect(validators.emailInspectionValidator('user+tag@domain.io', {})).toBe(
      false,
    );
  });
});

describe('validators.stringInspectionValidator', () => {
  it('passes when length matches exact stringLength', () => {
    expect(
      validators.stringInspectionValidator('1234', { stringLength: 4 }),
    ).toBe(true);
  });
  it('fails when length does not match exact stringLength', () => {
    expect(
      validators.stringInspectionValidator('123', { stringLength: 4 }),
    ).toBe(false);
  });
  it('passes when length is inside [stringMin, stringMax]', () => {
    expect(
      validators.stringInspectionValidator('abc', {
        stringMin: 2,
        stringMax: 5,
      }),
    ).toBe(true);
  });
  it('fails when length is below stringMin', () => {
    expect(
      validators.stringInspectionValidator('a', { stringMin: 2, stringMax: 5 }),
    ).toBe(false);
  });
  it('fails when length is above stringMax', () => {
    expect(
      validators.stringInspectionValidator('abcdef', {
        stringMin: 2,
        stringMax: 5,
      }),
    ).toBe(false);
  });
  it('coerces string bounds (OneEntry sometimes returns them as strings)', () => {
    expect(
      validators.stringInspectionValidator('abc', {
        stringMin: '2',
        stringMax: '5',
      }),
    ).toBe(true);
  });
});

describe('validators.correctPasswordValidator', () => {
  it('returns true when values match', () => {
    expect(validators.correctPasswordValidator('Pass1!', 'Pass1!')).toBe(true);
  });
  it('returns false when values differ', () => {
    expect(validators.correctPasswordValidator('Pass1!', 'Pass2!')).toBe(false);
  });
  it('treats empty strings as a valid match (caller must combine with requiredValidator)', () => {
    expect(validators.correctPasswordValidator('', '')).toBe(true);
  });
  it('is case-sensitive', () => {
    expect(validators.correctPasswordValidator('Pass1!', 'pass1!')).toBe(false);
  });
});

describe('validators.fieldMaskValidator', () => {
  it('accepts a value that matches the OneEntry mask', () => {
    // "$9[[space]]999[[space]]999[[space]]9999" → international phone
    expect(
      validators.fieldMaskValidator('+1 415 555 2671', {
        maskValue: '$9[[space]]999[[space]]999[[space]]9999',
      }),
    ).toBe(true);
  });

  it('rejects a value that does not match the mask', () => {
    expect(
      validators.fieldMaskValidator('not a phone', { maskValue: '9999' }),
    ).toBe(false);
  });

  it('rejects a partial match (compileRegex anchors the pattern)', () => {
    expect(validators.fieldMaskValidator('12345', { maskValue: '9999' })).toBe(
      false,
    );
  });

  it('accepts when mask matches an empty string for an empty mask', () => {
    // Empty mask compiles to /^$/ — only empty string passes.
    expect(validators.fieldMaskValidator('', { maskValue: '' })).toBe(true);
    expect(validators.fieldMaskValidator('x', { maskValue: '' })).toBe(false);
  });
});

describe('validators.stringInspectionValidator — additional edge cases', () => {
  it('stringLength=0 falls through to the [min,max] branch (not a hard requirement)', () => {
    // stringLength only takes effect when > 0; with 0 it skips to the min/max
    // branch. Without bounds `+undefined` is NaN, so both comparisons are
    // false and NOTHING passes — even the empty string. (The restaurant
    // project defaults min/max to 0 via `?? 0`, where '' passes; if that fix
    // is ported here, update these expectations.)
    expect(validators.stringInspectionValidator('', { stringLength: 0 })).toBe(
      false,
    );
    expect(validators.stringInspectionValidator('a', { stringLength: 0 })).toBe(
      false,
    );
  });

  it('without bounds, nothing passes (NaN comparisons reject every length)', () => {
    expect(validators.stringInspectionValidator('', {})).toBe(false);
    expect(validators.stringInspectionValidator('a', {})).toBe(false);
  });

  it('boundary lengths — exactly at stringMin and stringMax', () => {
    expect(
      validators.stringInspectionValidator('ab', {
        stringMin: 2,
        stringMax: 4,
      }),
    ).toBe(true);
    expect(
      validators.stringInspectionValidator('abcd', {
        stringMin: 2,
        stringMax: 4,
      }),
    ).toBe(true);
  });

  it('exact stringLength wins even when value is outside [min,max]', () => {
    // The exact-length branch returns early, so out-of-range bounds do not matter.
    expect(
      validators.stringInspectionValidator('1234', {
        stringLength: 4,
        stringMin: 10,
        stringMax: 20,
      }),
    ).toBe(true);
  });
});

describe('validators.requiredValidator — additional', () => {
  it('returns true for any single character (including punctuation/digits)', () => {
    expect(validators.requiredValidator('0', {})).toBe(true);
    expect(validators.requiredValidator('!', {})).toBe(true);
  });

  it('returns true for multi-character strings', () => {
    expect(validators.requiredValidator('hello world', {})).toBe(true);
  });
});
