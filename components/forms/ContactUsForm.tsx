/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IFormsPost } from 'oneentry/dist/formsData/formsDataInterfaces';
import type { FC, FormEvent, Key } from 'react';
import React, { useState } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

import Loader from '../shared/Loader';
// import Spinner from '../shared/Spinner';
import ErrorMessage from './inputs/ErrorMessage';
import { FormCaptcha } from './inputs/FormCaptcha';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ContactUsForm: FC = () => {
  const { data, isLoading } = useGetFormByMarkerQuery({ marker: 'contact_us' });

  const [token, setToken] = useState<string>('');
  const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fieldsData = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    first_nme: {
      value: string;
    };
    email: {
      value: string;
    };
    surname: {
      value: string;
    };
    topic: {
      value: string;
    };
    text: {
      value: string;
    };
    spam: {
      value: boolean;
    };
  };

  const formFields = data?.attributes
    .slice()
    .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyFormData: {
      marker: string;
      type: string;
      value: string | object;
    }[] = [];

    if (formFields) {
      const propertiesArray = Object.keys(formFields);
      const transformedFormData = propertiesArray?.reduce((formData, i) => {
        const type = formFields[i].type;
        const marker = formFields[i].marker;
        const value = fieldsData[marker as keyof typeof fieldsData].value;
        let newData = {
          marker: marker,
          type: 'string',
          value: value,
        } as {
          marker: string;
          type: string;
          value: string | object;
        };

        if (type === 'list') {
          newData = {
            marker: marker,
            type: 'list',
            value: {
              title: value,
              value: value,
            },
          };
        }
        if (type === 'text') {
          newData = {
            marker: marker,
            type: 'text',
            value: [
              {
                htmlValue: '',
                plainValue: value,
              },
            ],
          };
        }
        if (newData) {
          formData.push(newData);
        }
        return formData;
      }, emptyFormData);

      const formData: IFormsPost = {
        formIdentifier: 'contact_us',
        formData: transformedFormData,
      };

      try {
        setLoading(true);
        // await api.FormData.postFormsData(formData);
        setLoading(false);
        // dispatch(clearAllFieldsContactUs());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
      }
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
          } else if (field.type === 'spam') {
            return (
              <FormCaptcha
                key={index}
                setToken={setToken}
                setIsCaptcha={setIsCaptcha}
              />
            );
          } else {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default ContactUsForm;
