import type { IAuthFormData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { api } from '@/app/api';
import type { IProducts } from '@/app/types/global';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Update user state with API Users
 * @async
 * @param   {object}      props           - object
 * @param   {number[]}    props.favorites - array of products ids
 * @param   {IProducts[]} props.cart      - array of products
 * @param   {IUserEntity} props.user      - user object
 * @returns {boolean}                     - true if user state updated successfully, false otherwise
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const updateUserState = async ({
  favorites,
  cart,
  user,
}: {
  favorites: number[];
  cart: IProducts[];
  user: IUserEntity;
}): Promise<boolean> => {
  if (!user) {
    return false;
  }

  const formData: IAuthFormData[] = user.formData
    .map((item) => {
      // Skip otp_code fields
      if (item.marker === 'otp_code') {
        return undefined;
      }

      return {
        marker: item.marker,
        type: 'string',
        value: item.value,
      };
    })
    .filter((item): item is IAuthFormData => item !== undefined);

  const email = user.formData.find((item) => item.marker === 'email_reg');
  const phone = user.formData.find((item) => item.marker === 'phone_reg');

  try {
    const res = await api.Users.updateUser({
      formIdentifier: 'reg',
      formData: formData,
      state: {
        favorites: favorites.length > 0 ? favorites : user.state.favorites,
        cart: cart.length > 0 ? cart : user.state.cart,
      },
      notificationData: {
        email: email?.value || '',
        phonePush: [],
        phoneSMS: phone?.value || '',
      },
    });

    if (!res || isIError(res)) {
      return false;
    }

    if (res === true) {
      return true;
    }
    return false;
  } catch (error) {
    const apiError = handleApiError('updateUser', error);
    // eslint-disable-next-line no-console
    console.log('Error updating user state:', apiError.message);
    return false;
  }
};

export const clearUserState = async (user: IUserEntity) => {
  return updateUserState({ favorites: [], cart: [], user });
};
