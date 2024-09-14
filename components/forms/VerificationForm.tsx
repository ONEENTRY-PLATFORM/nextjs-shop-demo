import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import { api, logInUser } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { addField } from '@/app/store/reducers/FormFieldsSlice';

import FormSubmitButton from './inputs/FormSubmitButton';

const VerificationForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { authenticate } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setOpen, setComponent, action } = useContext(OpenDrawerContext);

  const [isLoading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    phone_reg: {
      valid: boolean;
      value: string;
    };
    email_reg: {
      valid: boolean;
      value: string;
    };
    password_reg: {
      valid: boolean;
      value: string;
    };
    otp_code: {
      valid: boolean;
      value: number;
    };
  };

  useEffect(() => {
    if (!otp) {
      return;
    }
    dispatch(
      addField({
        otp_code: {
          valid: true,
          value: otp,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length < 6) {
      return;
    }

    try {
      setLoading(true);
      if (action !== 'activateUser') {
        const result = await api.AuthProvider.checkCode(
          'email',
          fields['email_reg'].value,
          otp,
        );
        if (result) {
          setComponent('ResetPasswordForm');
        }
        setLoading(false);
      } else {
        const result = await api.AuthProvider.activateUser(
          'email',
          fields['email_reg'].value,
          otp,
        );
        if (result) {
          try {
            await logInUser({
              method: 'email',
              login: fields['email_reg'].value,
              password: fields['password_reg'].value,
            });
            authenticate();
            // redirect after activate user with otp
            router.push('/profile');
            setLoading(false);
            setOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            console.log(e);
          }
        }
      }
      setError('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      setLoading(true);
      const res = await api.AuthProvider.generateCode(
        'email',
        fields['email_reg'].value,
        'generate_code',
      );
      console.log(res);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSubmit(e)}
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
          containerStyle={
            'grid max-w-full grid-cols-6 justify-between gap-2 max-md:gap-2'
          }
          inputStyle={
            'relative box-border flex h-[70px] min-w-[14%] flex-col rounded border border-solid border-neutral-100 bg-neutral-100 p-2.5 text-center text-2xl font-medium text-neutral-600'
          }
        />
        <div className="self-end text-xs text-orange-500 max-md:mr-2.5">
          <span className="text-gray-400">Did not receive the OTP? </span>
          <button
            className="font-bold text-orange-500"
            type="button"
            onClick={onResend}
          >
            RESEND
          </button>
        </div>
      </div>

      <FormSubmitButton title="Verify now" isLoading={isLoading} />
      {error && <div className="text-center text-sm text-red-500">{error}</div>}
    </form>
  );
};

export default VerificationForm;
