import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { getApi, isError } from '@/app/api';
import type { IProducts } from '@/app/types/global';

/**
 * Update the authenticated user's `state` (cart + favorites) on the server.
 *
 * Fetches a **fresh** `IUserEntity` immediately before writing — never trust a
 * cached `user` snapshot, since other code may have mutated `state.cart` or
 * `state.favorites` between the time it was captured and now (per MCP rule
 * `tokens` / `user.state`). Spreads the fresh `state` so unrelated fields
 * (settings, history, recently viewed, …) are preserved.
 * @async
 * @param   {object}           props           - Update payload.
 * @param   {number[]}         props.favorites - Favorites product IDs.
 * @param   {IProducts[]}      props.cart      - Cart items.
 * @returns {Promise<boolean>}                 True on success, false otherwise.
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const updateUserState = async ({
  favorites,
  cart,
}: {
  favorites: number[];
  cart: IProducts[];
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

  const res = await getApi().Users.updateUser({
    formIdentifier: fresh.formIdentifier,
    formData,
    state: {
      ...fresh.state,
      favorites: favorites.length > 0 ? favorites : fresh.state?.favorites,
      cart: cart.length > 0 ? cart : fresh.state?.cart,
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
 * @async
 * @returns {Promise<boolean>} True on success, false otherwise.
 */
export const clearUserState = async (): Promise<boolean> =>
  updateUserState({ favorites: [], cart: [] });
