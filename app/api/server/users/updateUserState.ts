import type { Key } from 'react';

import { api } from '@/app/api';
import type { IProducts } from '@/app/types/global';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Update user state with API Users
 * @async
 * @param favorites array of products ids
 * @param cart array of products
 * @param user any
 * @see {@link https://doc.oneentry.cloud/docs/users OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns bool
 */
export const updateUserState = async ({
  favorites,
  cart,
  user,
}: {
  favorites: number[];
  cart: IProducts[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}) => {
  if (!user) {
    return;
  }
  const formData = user.formData.map(
    (
      item: {
        marker: string;
        type: string;
        value: string;
      },
      i: Key,
    ) => {
      const candidate = {
        marker: item.marker,
        type: 'string',
        value: user.formData[i as keyof typeof user.formData].value,
      };
      if (item.marker === 'otp_code') {
        return;
      }
      return candidate;
    },
    [],
  );
  const email = user.formData.find(
    (
      item: {
        marker: string;
      },
      i: Key,
    ) => {
      if (item.marker === 'email_reg') {
        return user.formData[i as keyof typeof user.formData].value;
      }
    },
    [],
  );
  const phone = user.formData.find(
    (
      item: {
        marker: string;
      },
      i: Key,
    ) => {
      if (item.marker === 'phone_reg') {
        return user.formData[i as keyof typeof user.formData].value;
      }
    },
    [],
  );

  try {
    const res = await api.Users.updateUser({
      formIdentifier: 'reg',
      formData: [...formData],
      state: {
        favorites: favorites.length > 0 ? favorites : user.state.favorites,
        cart: cart.length > 0 ? cart : user.state.cart,
      },
      notificationData: {
        email: email?.value,
        phonePush: [],
        phoneSMS: phone?.value,
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
    const apiError = handleApiError(error);
    // eslint-disable-next-line no-console
    console.log('Error updating user state:', apiError.message);
    return false;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearUserState = async (user: any) => {
  return updateUserState({ favorites: [], cart: [], user: user });
};
