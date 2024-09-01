import React, { useContext, useState } from 'react';
// import OTPInputs from './inputs/OTPInputs';
import OtpInput from 'react-otp-input';

import { api, logInUser } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';

import FormSubmitButton from './inputs/FormSubmitButton';

const VerificationForm: React.FC = () => {
  const { authenticate } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
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
    if (otp.length < 6) {
      return;
    }

    try {
      const result = await api.AuthProvider.activateUser(
        'email',
        fields['email_reg'].value,
        otp,
      );
      if (result) {
        await logInUser({
          method: 'email',
          login: fields['email_reg'].value,
          password: fields['password_reg'].value,
        });
        authenticate();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };

  const onResend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      await api.AuthProvider.generateCode(
        'email',
        fields['email_reg'].value,
        'generate_code',
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
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
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          containerStyle={'flex justify-between gap-3.5 max-md:gap-2'}
          inputStyle={
            'relative mx-auto box-border flex h-[70px] min-w-[50px] shrink-0 flex-col rounded border border-solid border-neutral-100 bg-neutral-100 p-2.5 text-center text-2xl font-medium text-neutral-600 max-md:w-[40px]'
          }
        />
        <div className="-mt-px self-end text-xs text-orange-500 max-md:mr-2.5">
          <span className="text-gray-400">Did not receive the OTP? </span>
          <button
            className="font-bold text-orange-500"
            type="button"
            onClick={(e) => onResend(e)}
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
