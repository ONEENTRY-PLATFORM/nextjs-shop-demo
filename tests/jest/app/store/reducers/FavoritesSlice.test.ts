import { describe, expect, it } from '@jest/globals';

import favoritesReducer, {
  addFavorites,
  removeAllFavorites,
  removeFavorites,
  selectIsFavorites,
  setFavoritesVersion,
} from '@/app/store/reducers/FavoritesSlice';

const initial = () => favoritesReducer(undefined, { type: '@@INIT' });

describe('FavoritesSlice — addFavorites', () => {
  it('adds a new product id', () => {
    const state = favoritesReducer(initial(), addFavorites(1));
    expect(state.products).toEqual([1]);
  });

  it('dedupes — same id added twice stays once', () => {
    let state = favoritesReducer(initial(), addFavorites(1));
    state = favoritesReducer(state, addFavorites(1));
    expect(state.products).toEqual([1]);
  });

  it('keeps insertion order', () => {
    let state = favoritesReducer(initial(), addFavorites(3));
    state = favoritesReducer(state, addFavorites(1));
    state = favoritesReducer(state, addFavorites(2));
    expect(state.products).toEqual([3, 1, 2]);
  });
});

describe('FavoritesSlice — removeFavorites', () => {
  it('removes an existing id by value', () => {
    let state = favoritesReducer(initial(), addFavorites(1));
    state = favoritesReducer(state, addFavorites(2));
    state = favoritesReducer(state, removeFavorites(1));
    expect(state.products).toEqual([2]);
  });

  it('is a noop when id is absent', () => {
    const state = favoritesReducer(initial(), removeFavorites(999));
    expect(state.products).toEqual([]);
  });
});

describe('FavoritesSlice — removeAllFavorites', () => {
  it('empties the list', () => {
    let state = favoritesReducer(initial(), addFavorites(1));
    state = favoritesReducer(state, addFavorites(2));
    state = favoritesReducer(state, removeAllFavorites());
    expect(state.products).toEqual([]);
  });
});

describe('FavoritesSlice — setFavoritesVersion', () => {
  it('writes the version field', () => {
    const state = favoritesReducer(initial(), setFavoritesVersion(7));
    expect(state.version).toBe(7);
  });
});

describe('FavoritesSlice — selectIsFavorites selector', () => {
  it('returns true when the id is in the list', () => {
    const wrapped = {
      favoritesReducer: favoritesReducer(initial(), addFavorites(42)),
    };
    expect(selectIsFavorites(wrapped, 42)).toBe(true);
  });

  it('returns false when the id is not in the list', () => {
    const wrapped = {
      favoritesReducer: favoritesReducer(initial(), addFavorites(42)),
    };
    expect(selectIsFavorites(wrapped, 99)).toBe(false);
  });
});
