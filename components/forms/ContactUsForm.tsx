'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useRouter } from 'next/navigation';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, FormEvent, Key } from 'react';
import React, { useState } from 'react';

import { logInUser, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

import Loader from '../shared/Loader';
// import Spinner from '../shared/Spinner';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ContactUsForm: FC = () => {
  // const router = useRouter();
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'contact_us' });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { first_nme, email } = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    first_nme: {
      value: string;
    };
    email: {
      value: string;
    };
  };

  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!first_nme || !email) {
      return;
    }

    try {
      setLoading(true);
      // const result = await logInUser({
      //   method: 'email',
      //   first_nme: first_nme.value,
      //   email: email.value,
      // });
      setLoading(false);
      // if (result.error) {
      //   throw new Error(result?.error);
      // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form
      className="mx-auto flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSubmitForm(e)}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-neutral-600">CS</h2>
      </div>

      <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
        {formFields?.map((field: IAttributes, index: Key) => {
          if (field.type === 'button') {
            return (
              <FormSubmitButton
                key={index}
                title="Submit"
                isLoading={loading}
              />
            );
          }
          return <FormInput key={index} {...field} />;
        })}
      </div>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default ContactUsForm;
