import React, { useContext, useEffect } from 'react';

import { useGetForm } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { useAppDispatch } from '@/app/store/hooks';

// import { addField } from '@/app/store/reducers/SignUpSlice';
import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

const SignUpForm: React.FC = () => {
  const fields = useAppSelector((state) => state.signUpReducer.fields);
  const dispatch = useAppDispatch();

  const data = useGetForm({
    marker: 'reg',
  });
  useEffect(() => {
    if (data.loading) {
      return;
    }
    // data.form?.attributes.forEach((field) => {
    //   dispatch(
    //     addField({
    //       [field.marker]: {
    //         valid: validate,
    //         value: value,
    //       },
    //     }),
    //   );
    // });
    // console.log(data.form?.attributes);
    // console.log(data.initialFormData);
  }, [data]);

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

  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Sign up
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Sign in or create account to quickly manage order
        </p>
      </div>
      <div className="relative mb-auto box-border flex shrink-0 flex-col gap-4">
        {data.form?.attributes.map((field: unknown, index: React.Key) => (
          <FormInput key={index} {...field} />
        ))}
      </div>
      <SubmitButton title="SIGN UP" class="" icon="" />
    </form>
  );
};

export default SignUpForm;
