/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import { getApi, isError, logInUser } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import type { FormProps } from '@/app/types/global';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import ErrorMessage from './inputs/ErrorMessage';
import FormSubmitButton from './inputs/FormSubmitButton';

// ⚠️ DO NOT guess — verify these event markers in OneEntry admin panel → Events.
const EVENT_CHECK_CODE = 'reg';
const EVENT_GENERATE_CODE = 'generate_code';

/**
 * VerificationForm props
 * @property {IAttributeValues} dict - dictionary from server api
 */
interface VerificationFormProps extends FormProps {
  dict: IAttributeValues;
}

/**
 * VerificationForm component for handling OTP verification.
 * This component renders a form for users to enter a one-time password (OTP) for account verification
 * during registration or password reset processes. It also provides functionality to resend the OTP.
 * @param   {VerificationFormProps} props      - Component properties
 * @param   {IAttributeValues}      props.dict - Dictionary with localized values from server API containing text for UI elements
 * @returns {JSX.Element}                      VerificationForm component with OTP input and submission functionality
 */
const VerificationForm = ({ dict }: VerificationFormProps): JSX.Element => {
  /** Router for navigation with transitions */
  const router = useTransitionRouter();
  /** Current locale for building locale-prefixed navigation paths */
  const params = useParams();
  const lang = (params.lang as string) || 'en';
  /** Redux dispatch function for updating state */
  const dispatch = useAppDispatch();
  /** Authentication context for user authentication */
  const { authenticate } = useContext(AuthContext);
  /** Modal context for controlling form modal state */
  const { setOpen, setComponent, action } = useContext(OpenDrawerContext);

  /** State for managing loading status during API calls */
  const [isLoading, setLoading] = useState(false);
  /** State for storing the OTP code entered by the user */
  const [otp, setOtp] = useState('');
  /** State for storing error messages */
  const [error, setError] = useState('');
  /**
   * Resend cooldown countdown in seconds. Seeded to the SDK default (~80s)
   * because a code was just sent in the previous step; the exact
   * `systemCodeTlsSec` is applied after the first resend.
   */
  const [cooldown, setCooldown] = useState(80);

  /** Extract localized text values from the dictionary */
  const {
    verification,
    enter_otp_code,
    resend_text,
    receive_otp_text,
    verify_now_text,
  } = dict;

  /** Get form fields from Redux state */
  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  /** Set OTP code to formFields reducer when it changes */
  useEffect(() => {
    /** Only dispatch if OTP has a value */
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
  }, [dispatch, otp]);

  /** Decrement the cooldown every second while it is active */
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /**
   * Submit form handle for checkCode/activateUser
   * Processes the OTP based on the current action (registration verification or password reset)
   * @param   {FormEvent<HTMLFormElement>} e - FormEvent from form submission
   * @returns {Promise<void>}                Promise that resolves when the form submission is complete
   */
  const onSubmitHandle = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      /** Prevent default form submission behavior */
      e.preventDefault();

      /** Validate OTP length before processing */
      if (otp.length < 6) {
        return;
      }

      try {
        /** Set loading state and clear previous errors */
        setLoading(true);
        setError('');

        /** Check OTP code with API AuthProvider based on the current action */
        if (action !== 'activateUser') {
          /** Handle password reset verification */
          const result = await getApi().AuthProvider.checkCode(
            'email',
            String(fields.email_reg?.value || ''),
            EVENT_CHECK_CODE, // Registration context
            otp,
          );

          /** The SDK returns errors as IError instead of throwing */
          if (isError(result)) {
            setError(getApiErrorMessage(result));
          } else if (result) {
            /** If verification is successful, show reset password form */
            setComponent('ResetPasswordForm');
          } else {
            setError('Invalid or expired code. Please try again.');
          }
          setLoading(false);
        }
        // Handle user activation for new registrations
        else {
          /** Activate user with the provided OTP */
          const result = await getApi().AuthProvider.activateUser(
            'email',
            String(fields.email_reg?.value || ''),
            otp,
          );

          /** The SDK returns errors as IError instead of throwing */
          if (isError(result)) {
            setError(getApiErrorMessage(result));
          } else if (result) {
            /** If user activation is successful, log in the user */
            try {
              /** Log in the user with their credentials */
              const loginResult = await logInUser({
                login: String(fields.email_reg?.value || ''),
                password: String(fields.password_reg?.value || ''),
              });

              /** Save refresh token before authenticating */
              if (loginResult.data?.refreshToken) {
                localStorage.setItem(
                  'refresh-token',
                  loginResult.data.refreshToken,
                );
              }

              /**
               * Authenticate the user and redirect to the locale-prefixed
               * profile page (a bare `/profile` flashes the home skeleton).
               */
              authenticate();
              router.push(`/${lang}/profile`);
              setOpen(false);
            } catch (e: any) {
              setError(getApiErrorMessage(e));
            }
          } else {
            setError('Invalid or expired code. Please try again.');
          }
        }
        setLoading(false);
      } catch (e: any) {
        setError(getApiErrorMessage(e));
        setLoading(false);
      }
    },
    [otp, action, fields, setComponent, authenticate, router, setOpen, lang],
  );

  /**
   * Generate and resend verification code
   * Requests a new OTP to be sent to the user's email
   * @returns {Promise<void>} Promise that resolves when the resend operation is complete
   */
  const onResendHandle = useCallback(async (): Promise<void> => {
    try {
      /** Set loading state and clear previous errors */
      setLoading(true);
      setError('');

      try {
        /** Request a new verification code from the API */
        const result = await getApi().AuthProvider.generateCode(
          'email',
          String(fields.email_reg?.value || ''),
          EVENT_GENERATE_CODE,
        );

        /** The SDK returns errors as IError instead of throwing */
        if (isError(result)) {
          setError(getApiErrorMessage(result));
        } else {
          /** Fetch the provider config to start the resend cooldown */
          const provider =
            await getApi().AuthProvider.getAuthProviderByMarker('email');
          if (!isError(provider)) {
            setCooldown(
              Number(
                (
                  provider as {
                    config?: { systemCodeTlsSec?: string | number };
                  }
                )?.config?.systemCodeTlsSec,
              ) || 80,
            );
          }
        }
      } catch (e: any) {
        setError(getApiErrorMessage(e));
      }
      setLoading(false);
    } catch (e: any) {
      setError(getApiErrorMessage(e));
      setLoading(false);
    }
  }, [fields]);

  return (
    /* Form animation wrapper with loading state */
    <FormAnimations isLoading={isLoading}>
      {/** OTP verification form */}
      <form
        className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
        onSubmit={onSubmitHandle}
      >
        {/** Form header with title and description */}
        <div className="relative mb-5 box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
            {verification?.value as string}
          </h2>
          <p className="text-xs text-gray-400 max-md:max-w-full">
            {enter_otp_code?.value as string}
          </p>
        </div>

        {/** OTP input section */}
        <div className="relative mb-8 box-border flex shrink-0 flex-col gap-6">
          {/** OTP input fields component */}
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

          {/** Resend code section */}
          <div className="self-end text-xs text-orange-500 max-md:mr-2.5">
            <span className="text-gray-400">
              {receive_otp_text?.value as string}{' '}
            </span>
            {/** Resend button to request a new OTP */}
            <button
              className="font-bold text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={onResendHandle}
              disabled={cooldown > 0 || isLoading}
            >
              {cooldown > 0
                ? `${resend_text?.value as string} (${cooldown})`
                : (resend_text?.value as string)}
            </button>
          </div>
        </div>

        {/** Submit button for OTP verification */}
        <FormSubmitButton
          title={verify_now_text?.value as string}
          isLoading={isLoading}
          index={0}
        />
        {/** Display error message if present */}
        {error && <ErrorMessage error={error} />}
      </form>
    </FormAnimations>
  );
};

export default VerificationForm;
