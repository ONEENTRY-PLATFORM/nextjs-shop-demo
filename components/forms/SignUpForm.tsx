import React, { useContext, useEffect } from 'react';

import { api, useGetForm } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

// import { useAppDispatch } from '@/app/store/hooks';
// import { addField } from '@/app/store/reducers/FormFieldsSlice';
// import { signUpFormFields } from '../data';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

const SignUpForm: React.FC = () => {
  // const dispatch = useAppDispatch();
  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
    };
    password_reg: {
      value: string;
    };
  };
  console.log(fields);

  const data = useGetForm({
    marker: 'reg',
  });

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const login = fields.email_reg?.value;
    // const password = fields.password_reg?.value;

    // try {
    //   const res = await api.AuthProvider.signUp('email', data, 'en_US');
    //   console.log();
    // } catch (e: unknown) {
    //   console.log(e);
    // }

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

    // try {
    //   const res = await api.AuthProvider.signUp('email', data, 'en_US');
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
    //   } else {
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
    <form
      onSubmit={(e) => onSignUp(e)}
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Sign up
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Sign in or create account to quickly manage order
        </p>
      </div>
      <div className="relative mb-auto box-border flex shrink-0 flex-col gap-4">
        {data.form?.attributes.map(
          (
            field: {
              localizeInfos: {
                title: string;
              };
              marker: string;
            },
            index: React.Key,
          ) => <FormInput key={index} {...field} />,
        )}
      </div>
      <SubmitButton title="SIGN UP" class="" icon="" />
    </form>
  );
};

export default SignUpForm;
