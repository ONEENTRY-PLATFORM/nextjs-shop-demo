/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX } from 'react';
import { useContext, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import { api, logInUser } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import type { FormProps } from '@/app/types/global';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import ErrorMessage from './inputs/ErrorMessage';
import FormSubmitButton from './inputs/FormSubmitButton';

/**
 * VerificationForm props
 * @property {IAttributeValues} dict - dictionary from server api
 */
interface VerificationFormProps extends FormProps {
  dict: IAttributeValues;
}

/**
 * VerificationForm component for handling OTP verification.
 * @param   {VerificationFormProps} props      - VerificationForm props.
 * @param   {IAttributeValues}      props.dict - dictionary from server api containing localized text.
 * @returns {JSX.Element}                      VerificationForm component.
 */
const VerificationForm = ({ dict }: VerificationFormProps): JSX.Element => {
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();
  const { authenticate } = useContext(AuthContext);
  const { setOpen, setComponent, action } = useContext(OpenDrawerContext);

  const [isLoading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const {
    verification,
    enter_otp_code,
    resend_text,
    receive_otp_text,
    verify_now_text,
  } = dict;

  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  // set otp code to formFields reducer
  useEffect(() => {
    if (otp) {
      dispatch(
        addField({
          otp_code: {
            valid: true,
            value: otp,
          },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  /**
   * Submit form handle for checkCode/activateUser
   * @param   {FormEvent<HTMLFormElement>} e - FormEvent from form submission
   * @returns {Promise<void>}                Promise that resolves when the form submission is complete
   */
  const onSubmitHandle = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (otp.length < 6) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      // check OTP code with API AuthProvider
      if (action !== 'activateUser') {
        // checkCode
        const result = await api.AuthProvider.checkCode(
          'email',
          fields.email_reg?.value || '',
          'reg', // generate_code??
          otp,
        );
        // if checkCode is ok show reset password form
        if (result) {
          setComponent('ResetPasswordForm');
        }
        setLoading(false);
      }
      // activateUser with API AuthProvider
      else {
        // activateUser
        const result = await api.AuthProvider.activateUser(
          'email',
          fields.email_reg?.value || '',
          otp,
        );
        // if activate User logInUser and authenticate
        if (result) {
          try {
            await logInUser({
              login: fields.email_reg?.value || '',
              password: fields.password_reg?.value || '',
            });
            authenticate();
            router.push('/profile');
            setOpen(false);
          } catch (e: any) {
            setError(e.message);
          }
        } else {
          setError('Error');
        }
      }
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  /**
   * Generate and resend verification code
   * @returns {Promise<void>} Promise that resolves when the resend operation is complete
   */
  const onResendHandle = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      try {
        await api.AuthProvider.generateCode(
          'email',
          fields.email_reg?.value || '',
          'generate_code',
        );
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <FormAnimations isLoading={isLoading}>
      <form
        className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onSubmitHandle(e)}
      >
        <div className="relative mb-5 box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
            {verification?.value}
          </h2>
          <p className="text-xs text-gray-400 max-md:max-w-full">
            {enter_otp_code?.value}
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
            <span className="text-gray-400">{receive_otp_text?.value} </span>
            <button
              className="font-bold text-orange-500"
              type="button"
              onClick={onResendHandle}
            >
              {resend_text?.value}
            </button>
          </div>
        </div>

        <FormSubmitButton
          title={verify_now_text?.value}
          isLoading={isLoading}
          index={0}
        />
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default VerificationForm;
