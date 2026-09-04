import { describe, expect, it } from '@jest/globals';

import { isFilteredShopView } from '@/app/utils/isFilteredShopView';
import { shopCrawlMeta } from '@/app/utils/shopCrawlMeta';

describe('isFilteredShopView', () => {
  it('treats a missing map and an empty map as the bare canonical listing', () => {
    expect(isFilteredShopView(undefined)).toBe(false);
    expect(isFilteredShopView({})).toBe(false);
  });

  it.each([['search'], ['minPrice'], ['maxPrice'], ['color'], ['in_stock']])(
    'flags "%s" as a filtered view',
    (key) => {
      expect(isFilteredShopView({ [key]: 'x' })).toBe(true);
    },
  );

  /*
    The filter drawer deletes a key when its control is cleared, but a
    hand-edited or bookmarked URL can still carry `?color=`. An empty value is
    the bare listing, not a filter that matches nothing.
  */
  it('ignores empty-string and nullish values', () => {
    expect(isFilteredShopView({ color: '' })).toBe(false);
    expect(isFilteredShopView({ color: undefined })).toBe(false);
  });

  it('treats an empty array value as canonical and a non-empty one as filtered', () => {
    expect(isFilteredShopView({ color: [] })).toBe(false);
    expect(isFilteredShopView({ color: ['red'] })).toBe(true);
  });

  it('treats page=1 and below as canonical but page>1 as filtered', () => {
    expect(isFilteredShopView({ page: '1' })).toBe(false);
    expect(isFilteredShopView({ page: '0' })).toBe(false);
    expect(isFilteredShopView({ page: '2' })).toBe(true);
    expect(isFilteredShopView({ page: ['3'] })).toBe(true);
  });

  it('ignores params the catalog does not facet on', () => {
    expect(
      isFilteredShopView({ utm_source: 'newsletter', sort: 'price' }),
    ).toBe(false);
  });
});

describe('shopCrawlMeta', () => {
  it('indexes the bare listing of a visible page', () => {
    expect(shopCrawlMeta({ searchParams: {} }).robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  /*
    `follow` stays true on purpose: the links out of a filtered listing lead to
    real product pages, and pagination is how a crawler walks past the first
    screen. Only the duplicate listing URL is kept out of the index.
  */
  it('de-indexes a filtered variant but keeps following its links', () => {
    expect(shopCrawlMeta({ searchParams: { color: 'red' } }).robots).toEqual({
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    });
  });

  it('de-indexes even the bare listing when the CMS page is not visible', () => {
    expect(
      shopCrawlMeta({ searchParams: {}, isVisible: false }).robots,
    ).toMatchObject({ index: false });
  });

  /*
    The canonical is owned by `generatePageMetadata`. Emitting one here too
    would give the same tag two sources of truth.
  */
  it('emits no canonical of its own', () => {
    expect(shopCrawlMeta({ searchParams: {} })).not.toHaveProperty(
      'alternates',
    );
  });
});
