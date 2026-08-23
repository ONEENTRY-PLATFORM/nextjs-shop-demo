import { describe, expect, it } from '@jest/globals';
import type { IMenusPages } from 'oneentry/types';

import { flatMenuToNested } from '@/components/utils/utils';

/*
 * Unit tests for flatMenuToNested — builds the nested main/side menu from the
 * flat `IMenusEntity.pages` array. Page ids and custom item ids share one id
 * space, so SDK 1.0.162 added `itemType` / `parentType` to address a parent
 * unambiguously; these guard both the disambiguated path and the fallback for
 * payloads that omit the two fields.
 */

/**
 * Builds a menu item with the mandatory `IMenusPages` fields filled in.
 * @param   {Partial<IMenusPages>} item - Fields under test (id, parentId, …).
 * @returns {IMenusPages}               A complete menu item.
 */
const menuItem = (item: Partial<IMenusPages>): IMenusPages => ({
  id: null,
  pageUrl: null,
  localizeInfos: {} as IMenusPages['localizeInfos'],
  attributeValues: {},
  position: 1,
  parentId: null,
  ...item,
});

describe('flatMenuToNested', () => {
  it('keeps a flat menu flat and assigns no children', () => {
    const nested = flatMenuToNested(
      [
        menuItem({ id: 52, pageUrl: 'category', itemType: 'page' }),
        menuItem({ id: 51, pageUrl: 'offer', itemType: 'page' }),
      ],
      null,
    );

    expect(nested).toHaveLength(2);
    expect(nested[0]?.children).toBeUndefined();
    expect(nested[1]?.children).toBeUndefined();
  });

  it('nests a child under its parent', () => {
    const nested = flatMenuToNested(
      [
        menuItem({ id: 1, pageUrl: 'shop' }),
        menuItem({ id: 2, pageUrl: 'shoes', parentId: 1 }),
      ],
      null,
    );

    expect(nested).toHaveLength(1);
    expect(nested[0]?.id).toBe(1);
    expect(nested[0]?.children).toHaveLength(1);
    expect((nested[0]?.children as IMenusPages[])[0]?.id).toBe(2);
  });

  it('nests by parentId alone when itemType/parentType are absent', () => {
    /* Pre-1.0.162 payload: no kind fields, so the id match has to be enough. */
    const nested = flatMenuToNested(
      [
        menuItem({ id: 10, pageUrl: 'about' }),
        menuItem({ id: 11, pageUrl: 'team', parentId: 10 }),
      ],
      null,
    );

    expect((nested[0]?.children as IMenusPages[])[0]?.pageUrl).toBe('team');
  });

  it('does not attach a child to a same-id parent of the other kind', () => {
    /* Page 7 and custom item 7 coexist; each child names its parent's kind. */
    const nested = flatMenuToNested(
      [
        menuItem({ id: 7, pageUrl: 'catalog', itemType: 'page' }),
        menuItem({ id: 7, pageUrl: null, itemType: 'custom' }),
        menuItem({
          id: 20,
          pageUrl: 'catalog-child',
          parentId: 7,
          parentType: 'page',
          itemType: 'page',
        }),
        menuItem({
          id: 21,
          pageUrl: 'custom-child',
          parentId: 7,
          parentType: 'custom',
          itemType: 'custom',
        }),
      ],
      null,
    );

    const [page, custom] = nested;
    expect(page?.itemType).toBe('page');
    expect(custom?.itemType).toBe('custom');

    /* Without the kind check both children would land under both parents. */
    expect(page?.children).toHaveLength(1);
    expect((page?.children as IMenusPages[])[0]?.id).toBe(20);
    expect(custom?.children).toHaveLength(1);
    expect((custom?.children as IMenusPages[])[0]?.id).toBe(21);
  });

  it('returns an empty array for an empty menu', () => {
    expect(flatMenuToNested([], null)).toEqual([]);
  });
});
