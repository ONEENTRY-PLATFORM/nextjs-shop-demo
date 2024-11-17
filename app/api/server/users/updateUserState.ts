import type { IError } from 'oneentry/dist/base/utils';
import type { Key } from 'react';

import { api } from '@/app/api';
import type { IProducts } from '@/app/types/global';

/**
 * Update user state with API Users
 * @param favorites array of products ids
 * @param cart array of products
 * @param user any
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
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

  if (!res || (res as IError)?.statusCode) {
    return false;
  }

  if (res === true) {
    return true;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearUserState = async (user: any) => {
  updateUserState({ favorites: [], cart: [], user: user });
};
