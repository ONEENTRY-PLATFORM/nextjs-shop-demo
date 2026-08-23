import type { IAuthFormData, IUserEntity } from 'oneentry/types';

import { getApi, isError } from '@/app/api';
import type { CartLedger, FavLedger } from '@/app/store/utils/ledger';
import {
  cartActiveProducts,
  favActiveIds,
  mergeLedger,
  normalizeCartLedger,
  normalizeFavLedger,
} from '@/app/store/utils/ledger';

/**
 * Update the authenticated user's `state` (cart + favorites) on the server.
 *
 * Fetches a **fresh** `IUserEntity` immediately before writing — never trust a
 * cached `user` snapshot, since other code may have mutated `state.cart` or
 * `state.favorites` between the time it was captured and now (per MCP rule
 * `tokens` / `user.state`). The incoming tombstone ledgers are re-merged with
 * the freshest server ledgers (see {@link mergeLedger}) so a concurrent change
 * from another device/tab is not clobbered and removed items never resurrect.
 *
 * Both shapes are written: the active arrays (`favorites` / `cart`) for legacy
 * readers, and the ledgers (`favoritesMeta` / `cartMeta`) for tombstone merges.
 * Unrelated `state` fields (settings, history, …) are preserved via spread.
 * @async
 * @param   {object}           props               - Update payload.
 * @param   {FavLedger}        props.favoritesMeta - Favorites tombstone ledger.
 * @param   {CartLedger}       props.cartMeta      - Cart tombstone ledger.
 * @returns {Promise<boolean>}                     True on success, false otherwise.
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const updateUserState = async ({
  favoritesMeta,
  cartMeta,
}: {
  favoritesMeta: FavLedger;
  cartMeta: CartLedger;
}): Promise<boolean> => {
  const fresh = (await getApi().Users.getUser()) as IUserEntity;
  if (!fresh || isError(fresh)) {
    return false;
  }

  const formData: IAuthFormData[] = fresh.formData
    .map((item) => {
      if (item.marker === 'otp_code') {
        return undefined;
      }
      return { marker: item.marker, type: 'string', value: item.value };
    })
    .filter((item): item is IAuthFormData => item !== undefined);

  const email = fresh.formData.find((item) => item.marker === 'email_reg');
  const phone = fresh.formData.find((item) => item.marker === 'phone_reg');

  /**
   * Re-merge the incoming ledgers with the freshest server ledgers. Tombstones
   * carry timestamps, so a newer removal still wins (no resurrection) while a
   * concurrent addition from another device is preserved (union kept).
   */
  const mergedFav = mergeLedger(favoritesMeta, normalizeFavLedger(fresh.state));
  const mergedCart = mergeLedger(cartMeta, normalizeCartLedger(fresh.state));

  const res = await getApi().Users.updateUser({
    formIdentifier: fresh.formIdentifier,
    formData,
    state: {
      ...fresh.state,
      favorites: favActiveIds(mergedFav),
      favoritesMeta: mergedFav,
      cart: cartActiveProducts(mergedCart),
      cartMeta: mergedCart,
    },
    notificationData: {
      email: (email?.value as string) || '',
      phonePush: [],
      phoneSMS: (phone?.value as string) || '',
    },
  });

  if (!res || isError(res)) {
    return false;
  }

  return res === true;
};

/**
 * Reset the authenticated user's cart and favorites on the server.
 *
 * Builds a tombstone for every item currently active on the server (stamped
 * "now") so the clear actually wins the merge inside {@link updateUserState}
 * instead of being ignored — an empty ledger would simply merge back to the
 * existing server state.
 * @async
 * @returns {Promise<boolean>} True on success, false otherwise.
 */
export const clearUserState = async (): Promise<boolean> => {
  const fresh = (await getApi().Users.getUser()) as IUserEntity;
  if (!fresh || isError(fresh)) {
    return false;
  }

  const ts = Date.now();
  const favoritesMeta: FavLedger = {};
  for (const id of favActiveIds(normalizeFavLedger(fresh.state))) {
    favoritesMeta[id] = { ts, removed: true };
  }
  const cartMeta: CartLedger = {};
  for (const product of cartActiveProducts(normalizeCartLedger(fresh.state))) {
    cartMeta[product.id] = { ts, removed: true };
  }

  return updateUserState({ favoritesMeta, cartMeta });
};
