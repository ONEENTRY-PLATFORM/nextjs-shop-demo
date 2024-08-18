import React, { useContext } from 'react';

import { api } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

interface FormSubmitButtonProps {
  title: string;
  icon: string;
  class: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ title }) => {
  const { authenticate } = useContext(AuthContext);
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  const useForm = () => {
    console.log(fields);
    // const formData = Object.keys(fields).reduce(
    //   (
    //     arr: Array<{
    //       marker: string;
    //       type: string;
    //       value: string;
    //     }>,
    //     field,
    //   ) => {
    //     const candidate = {
    //       marker: field,
    //       type: 'string',
    //       value: fields[field].value,
    //     };
    //     arr.push(candidate);
    //     return arr;
    //   },
    //   [],
    // );

    // const data: ISignUpData = {
    //   formIdentifier: 'reg',
    //   authData: [
    //     { marker: 'email_reg', value: fields.email_reg.value },
    //     { marker: 'password_reg', value: fields.password_reg.value },
    //   ],
    //   formData,
    //   notificationData: {
    //     email: fields.email_reg.value,
    //     phonePush: fields.phone_reg.value,
    //     phoneSMS: fields.phone_reg.value,
    //   },
    // };

    // try {
    // const res = await api.AuthProvider.signUp('email', data, 'en_US');
    //   if (res.isActive) {
    //     try {
    //       await logInUser({
    //         method: 'email',
    //         login: res.identifier,
    //         password: fields.password_reg.value,
    //       });
    //       authenticate();
    //     } catch (e: any) {
    //       Alert.alert(e.message);
    //     }
    // } else {
    //     navigateAuth('activate_user', {
    //       email: res.identifier,
    //       method: 'email',
    //       password: fields.password_reg.value,
    //       event: 'activate',
    //     });
    //   }
    // } catch (e: any) {
    //   Alert.alert(e?.message);
    // }
  };

  return (
    <button
      onClick={useForm}
      type="submit"
      className="mt-auto flex w-[282px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
    >
      {title}
    </button>
  );
};

export default FormSubmitButton;
