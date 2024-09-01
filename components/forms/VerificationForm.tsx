import React, { useContext } from 'react';

import { api, logInUser } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

import FormSubmitButton from './inputs/FormSubmitButton';
import OTPInputs from './inputs/OTPInputs';

const VerificationForm: React.FC = () => {
  const { authenticate } = useContext(AuthContext);
  const resend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e);
  };
  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    phone_reg: {
      value: string;
    };
    email_reg: {
      value: string;
    };
    password_reg: {
      value: string;
    };
  };

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // if (value.length < 6) {
    //   return;
    // }

    // try {
    //   const result = await api.AuthProvider.activateUser(
    //     params.method,
    //     params.email,
    //     value,
    //   );

    //   if (result) {
    //     await logInUser({
    //       method: 'email',
    //       login: params.email,
    //       password: params.password,
    //     });

    //     authenticate();
    //   }
    // } catch (e: any) {
    //   // Alert.alert(e.message);
    // }
  };
  return (
    <form
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      onSubmit={onSubmit}
    >
      <div className="relative mb-5 box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Verification
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Enter your OTP code here
        </p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-6">
        <OTPInputs inputCount={6} />

        <div className="-mt-px self-end text-xs text-orange-500 max-md:mr-2.5">
          <span className="text-gray-400">Did not receive the OTP? </span>
          <button
            className="font-bold text-orange-500"
            type="button"
            onClick={(e) => resend(e)}
          >
            RESEND
          </button>
        </div>
      </div>

      <FormSubmitButton title="Verify now" class="" icon="" isLoading={false} />
    </form>
  );
};

export default VerificationForm;
