import type { IError } from 'oneentry/dist/base/utils';
import type { Key } from 'react';

import { api } from '../api/api';

export const updateUserState = async ({
  favorites,
  cart,
  user,
}: {
  favorites?: number[];
  cart?: { id: number; quantity: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}) => {
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

  const res = await api.Users.updateUser({
    formIdentifier: 'reg',
    formData: [
      ...formData,
      // {
      //   marker: 'name_reg',
      //   type: 'string',
      //   value: 'pixel.comander@gmail.com',
      // },
      // {
      //   marker: 'email_reg',
      //   type: 'string',
      //   value: 'pixel.comander@gmail.com',
      // },
      // {
      //   marker: 'password_reg',
      //   type: 'string',
      //   value: '12345',
      // },
      // {
      //   marker: 'phone_reg',
      //   type: 'string',
      //   value: '+380950749626',
      // },
      // {
      //   marker: 'address_reg',
      //   type: 'string',
      //   value: 'test address',
      // },
    ],
    state: {
      ...(favorites && { favorites }),
      ...(cart && { cart }),
    },
    notificationData: {
      email: 'pixel.comander@gmail.com',
      phonePush: [],
      phoneSMS: '+380950749626',
    },
  });

  if (!res || (res as IError)?.statusCode) {
    return false;
  }

  if (res === true) {
    return true;
  }
};
