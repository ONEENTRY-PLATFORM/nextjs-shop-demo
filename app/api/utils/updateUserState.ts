import type { IError } from 'oneentry/dist/base/utils';

import { api } from '../api/api';

export const updateUserState = async ({
  favorites,
  cart,
}: {
  favorites?: number[];
  cart?: { id: number; quantity: number }[];
}) => {
  const res = await api.Users.updateUser({
    formIdentifier: 'reg',
    formData: [
      // {
      //   marker: 'name_reg',
      //   value: 'Johns',
      //   type: 'string',
      // },
      // {
      //   marker: 'phone_reg',
      //   value: '+79177815130',
      //   type: 'string',
      // },
      // {
      //   marker: 'address_reg',
      //   value: 'Ufa',
      //   type: 'string',
      // },
    ],
    state: {
      ...(favorites && { favorites }),
      ...(cart && { cart }),
    },
    authData: [],
    notificationData: {
      email: '',
      phonePush: [],
      phoneSMS: '',
    },
  });

  if (!res || (res as IError)?.statusCode) {
    return false;
  }

  if (res === true) {
    return true;
  }
};
