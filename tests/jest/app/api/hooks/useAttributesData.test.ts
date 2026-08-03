/*
 * Unit tests for `getImageUrl` from `app/api/hooks/useAttributesData.ts`.
 *
 * Ported from the nextjs-restaurant project and adapted to this project's
 * signature: `getImageUrl(marker, attributeValues, type)` reads the attribute
 * from the entity's `attributeValues` and transparently handles both `image`
 * value shapes (Products → object, Pages/Blocks → array — see
 * `.claude/rules/attribute-values.md`).
 */
import { describe, expect, it } from '@jest/globals';
import type { IAttributeValues } from 'oneentry/dist/base/utils';

/*
 * `useAttributesData` imports `components/utils/sanitize`, which pulls in
 * `sanitize-html` → its bundled `htmlparser2@12`, a pure-ESM package. Node 22
 * loads it through require(ESM); Jest's CJS runtime cannot and dies while
 * parsing the module. `getImageUrl` sanitizes nothing, so the sanitize module
 * is stubbed to keep the import chain loadable.
 */
jest.mock('@/components/utils/sanitize', () => ({
  sanitizeHTML: (html: string) => html,
}));

import { getImageUrl } from '@/app/api/hooks/useAttributesData';

/**
 * Wrap a raw attribute `value` into an `attributeValues` object under the
 * `pic` marker, mimicking a real entity payload.
 * @param   {unknown}          value - Raw attribute value (object, array, null, …).
 * @returns {IAttributeValues}       `attributeValues` fixture with a single `pic` attribute.
 */
const attrsWith = (value: unknown): IAttributeValues =>
  ({ pic: { value } }) as unknown as IAttributeValues;

describe('getImageUrl', () => {
  it('returns the downloadLink from a single image object (Products shape)', () => {
    expect(
      getImageUrl(
        'pic',
        attrsWith({ downloadLink: 'https://cdn.example.com/a.jpg' }),
      ),
    ).toBe('https://cdn.example.com/a.jpg');
  });

  it('returns the FIRST item downloadLink from an array (Pages/Blocks shape)', () => {
    expect(
      getImageUrl(
        'pic',
        attrsWith([
          { downloadLink: 'first.png' },
          { downloadLink: 'second.png' },
        ]),
      ),
    ).toBe('first.png');
  });

  it('returns "" when the attribute or attributeValues is missing', () => {
    expect(getImageUrl('pic', undefined)).toBe('');
    expect(getImageUrl('pic', {} as IAttributeValues)).toBe('');
  });

  it('returns "" when the value is null', () => {
    expect(getImageUrl('pic', attrsWith(null))).toBe('');
  });

  it('returns "" when downloadLink is missing on an object', () => {
    expect(getImageUrl('pic', attrsWith({}))).toBe('');
  });

  it('returns "" when an array is empty', () => {
    expect(getImageUrl('pic', attrsWith([]))).toBe('');
  });

  it('returns "" when the first array element has no downloadLink', () => {
    expect(
      getImageUrl('pic', attrsWith([{}, { downloadLink: 'unused.png' }])),
    ).toBe('');
  });

  it('returns previewLink for type="preview" when it is a string', () => {
    expect(
      getImageUrl(
        'pic',
        attrsWith({ downloadLink: 'full.png', previewLink: 'small.png' }),
        'preview',
      ),
    ).toBe('small.png');
  });

  it('falls back to downloadLink for type="preview" when previewLink is not a string', () => {
    // The CMS-generated preview is an object ({ default: [...], preview: [...] });
    // getImageUrl only returns string previews — object previews are read via getImagePreview().
    expect(
      getImageUrl(
        'pic',
        attrsWith({
          downloadLink: 'full.png',
          previewLink: { default: ['data:...'] },
        }),
        'preview',
      ),
    ).toBe('full.png');
  });
});
