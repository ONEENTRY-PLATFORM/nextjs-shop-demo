import type { IProducts } from '@/app/types/global';

/**
 * A single favorites ledger entry — the last known operation for a product id.
 * @property {number}  ts      - Timestamp (ms) of the last add/remove.
 * @property {boolean} removed - `true` when the id is a tombstone (removed).
 */
export type FavLedgerEntry = { ts: number; removed: boolean };

/**
 * Favorites ledger: a map of product id → last operation. Active favorites are
 * the entries where `removed === false`; the rest are tombstones that let a
 * deletion survive a later merge instead of resurrecting.
 */
export type FavLedger = Record<number, FavLedgerEntry>;

/**
 * A single cart ledger entry. Carries the product snapshot for active lines so
 * the merged cart can be rebuilt from the ledger alone.
 * @property {number}    ts      - Timestamp (ms) of the last mutation.
 * @property {boolean}   removed - `true` when the id is a tombstone (removed).
 * @property {IProducts} product - The cart line snapshot (omitted for tombstones).
 */
export type CartLedgerEntry = {
  ts: number;
  removed: boolean;
  product?: IProducts;
};

/**
 * Cart ledger: a map of product id → last operation (with line snapshot).
 */
export type CartLedger = Record<number, CartLedgerEntry>;

/**
 * Merge two tombstone ledgers with last-write-wins semantics per id.
 *
 * For every id present in either ledger the entry with the greater `ts` wins,
 * so a newer removal beats an older addition (deletion sticks) and a newer
 * addition beats an older removal (re-add works). On an exact `ts` tie the
 * non-removed entry wins, biasing toward keeping the item (union-friendly).
 * @param   {object} base     - Base ledger (typically the local/client state).
 * @param   {object} incoming - Incoming ledger (typically the server state).
 * @returns {object}          A new merged ledger; inputs are not mutated.
 */
export const mergeLedger = <T extends { ts: number; removed: boolean }>(
  base: Record<number, T>,
  incoming: Record<number, T>,
): Record<number, T> => {
  const out: Record<number, T> = { ...base };
  for (const key of Object.keys(incoming)) {
    const id = Number(key);
    const next = incoming[id];
    if (!next) {
      continue;
    }
    const prev = out[id];
    const wins =
      !prev ||
      next.ts > prev.ts ||
      (next.ts === prev.ts && prev.removed && !next.removed);
    if (wins) {
      out[id] = next;
    }
  }
  return out;
};

/**
 * Build a favorites ledger from a plain array of active ids (legacy shape).
 * @param   {number[]}  ids  - Active favorite product ids.
 * @param   {number}    [ts] - Timestamp to stamp each entry with (default `0`).
 * @returns {FavLedger}      Ledger with every id marked as active.
 */
export const favLedgerFromIds = (ids: number[], ts = 0): FavLedger => {
  const ledger: FavLedger = {};
  for (const id of ids) {
    ledger[id] = { ts, removed: false };
  }
  return ledger;
};

/**
 * Extract the active favorite ids from a ledger, ordered by add time.
 * @param   {FavLedger} ledger - The favorites ledger.
 * @returns {number[]}         Ids where `removed === false`, sorted by `ts`.
 */
export const favActiveIds = (ledger: FavLedger): number[] =>
  Object.keys(ledger)
    .map(Number)
    .filter((id) => ledger[id]?.removed === false)
    .sort((a, b) => (ledger[a]?.ts ?? 0) - (ledger[b]?.ts ?? 0) || a - b);

/**
 * Build a cart ledger from a plain array of cart lines (legacy shape).
 * @param   {IProducts[]} products - Active cart lines.
 * @param   {number}      [ts]     - Timestamp to stamp each entry with (default `0`).
 * @returns {CartLedger}           Ledger with every line marked as active.
 */
export const cartLedgerFromProducts = (
  products: IProducts[],
  ts = 0,
): CartLedger => {
  const ledger: CartLedger = {};
  for (const product of products) {
    ledger[product.id] = { ts, removed: false, product };
  }
  return ledger;
};

/**
 * Extract the active cart lines from a ledger, ordered by add time.
 * @param   {CartLedger}  ledger - The cart ledger.
 * @returns {IProducts[]}        Active line snapshots, sorted by `ts`.
 */
export const cartActiveProducts = (ledger: CartLedger): IProducts[] =>
  Object.keys(ledger)
    .map(Number)
    .filter((id) => ledger[id]?.removed === false && !!ledger[id]?.product)
    .sort((a, b) => (ledger[a]?.ts ?? 0) - (ledger[b]?.ts ?? 0) || a - b)
    .map((id) => ledger[id]?.product as IProducts);

/**
 * Read a favorites ledger out of the server-side `user.state`, tolerating the
 * legacy `favorites: number[]` shape (converted to a ledger with `ts = 0`).
 * @param   {object}    state - The server `user.state` object (or `undefined`).
 * @returns {FavLedger}       Normalized favorites ledger.
 */
export const normalizeFavLedger = (
  state: Record<string, unknown> | undefined,
): FavLedger => {
  const meta = state?.favoritesMeta;
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    return meta as FavLedger;
  }
  const ids = state?.favorites;
  if (Array.isArray(ids)) {
    return favLedgerFromIds(ids as number[]);
  }
  return {};
};

/**
 * Read a cart ledger out of the server-side `user.state`, tolerating the legacy
 * `cart: IProducts[]` shape (converted to a ledger with `ts = 0`).
 * @param   {object}     state - The server `user.state` object (or `undefined`).
 * @returns {CartLedger}       Normalized cart ledger.
 */
export const normalizeCartLedger = (
  state: Record<string, unknown> | undefined,
): CartLedger => {
  const meta = state?.cartMeta;
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    return meta as CartLedger;
  }
  const cart = state?.cart;
  if (Array.isArray(cart)) {
    return cartLedgerFromProducts(cart as IProducts[]);
  }
  return {};
};
