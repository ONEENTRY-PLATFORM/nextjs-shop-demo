'use client';

import type { IAttributes, IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC, FormEvent, Key } from 'react';
import { useContext, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FormAnimations from '@/components/forms/animations/FormAnimations';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

interface ForgotPasswordFormProps {
  lang: string;
  dict: IAttributeValues;
}

/**
 * ForgotPassword form
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns ForgotPassword form
 */
export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  lang,
  dict,
}) => {
  const { setComponent, setAction } = useContext(OpenDrawerContext);
  const [isError, setError] = useState<string>('');

  const { reset_descr, send_text } = dict;

  // get form data with RTK from API
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  const fields = useAppSelector((state) => state.formFieldsReducer.fields);

  // Submit form
  const onSubmitFormHandle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if email field exists
    if (!fields.email_reg) {
      setError('Email field is missing');
      return;
    }

    try {
      // generate verification code with API
      await api.AuthProvider.generateCode(
        'email',
        fields.email_reg.value,
        'generate_code',
      );
      // open Verification form
      setComponent('VerificationForm');
      setAction('checkCode');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
      if (e.statusCode === 400) {
        setTimeout(() => {
          setComponent('VerificationForm');
        }, 800);
      }
    }
  };

  if (!data || isLoading) {
    return <Loader />;
  }

  return (
    <FormAnimations isLoading={isLoading}>
      <form
        className="mx-auto flex min-h-[480px] max-w-[350px] flex-col gap-4 text-xl leading-5"
        onSubmit={(e) => onSubmitFormHandle(e)}
      >
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
            {data.localizeInfos?.titleForSite}
          </h2>
          <p className="text-xs text-gray-400 max-md:max-w-full">
            {reset_descr?.value}
          </p>
        </div>

        <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
          {data?.attributes.map((field: IAttributes, index: Key | number) => {
            if (field.marker === 'email_reg') {
              return (
                <FormInput key={index} index={index as number} {...field} />
              );
            }
            return;
          })}
        </div>

        <FormSubmitButton
          index={10}
          title={send_text?.value}
          isLoading={isLoading}
        />
        {isError && <ErrorMessage error={isError} />}
      </form>
    </FormAnimations>
  );
};

export default ForgotPasswordForm;
