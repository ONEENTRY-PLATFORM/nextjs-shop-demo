'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

import { useFormsData, useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearFields } from '@/app/store/reducers/FormFieldsSlice';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormReCaptcha from './inputs/FormReCaptcha';
import FormSubmitButton from './inputs/FormSubmitButton';

/**
 * ContactUs form.
 * @param   {object}      props           - ContactUs form props
 * @param   {string}      props.className - CSS className of ref element
 * @param   {string}      props.lang      - Current language shortcode
 * @returns {JSX.Element}                 ContactUs form component
 */
const ContactUsForm = memo(
  ({ className, lang }: { className?: string; lang: string }): JSX.Element => {
    // Captcha
    const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    /** Use form submission hook for loading state and API calls */
    const { loading, sendData } = useFormsData();

    /** Error state for form submission errors */
    const [error, setError] = useState<string>('');

    /** Success message state */
    const [successMessage, setSuccessMessage] = useState<string>('');

    /** Dispatch for Redux actions */
    const dispatch = useAppDispatch();

    /**
     * Fetch contact form data by marker using RTK Query
     * This retrieves form configuration and fields from the OneEntry CMS
     */
    const { data, isLoading } = useGetFormByMarkerQuery({
      marker: 'contact_us',
      lang,
    });

    /**
     * Get form field values from Redux store
     * These values are updated as the user interacts with form inputs
     */
    const fieldsData = useAppSelector(
      (state) => state.formFieldsReducer.fields,
    );

    /**
     * Sort form fields by position attribute (memoized)
     * This ensures fields are displayed in the correct order
     */
    const formFields = useMemo(() => {
      return data?.attributes
        ?.slice()
        .sort((a: IAttributes, b: IAttributes) => a.position - b.position);
    }, [data?.attributes]);

    /**
     * Get the first module form configuration
     * This contains additional settings for the form submission
     */
    const moduleFormConfig = data?.moduleFormConfigs?.[0];

    /**
     * Handle form submission
     * Transforms form data and sends it to the OneEntry API
     * @param {FormEvent<HTMLFormElement>} e - Form submission event
     */
    const onSubmitFormHandle = useCallback(
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emptyFormData: {
          marker: string;
          type: string;
          value: string | object;
        }[] = [];

        /** transform and send form data */
        if (formFields) {
          /** Get all form field property keys */
          const propertiesArray = Object.keys(formFields);

          /**
           * Transform form data based on field types
           * Each field is processed according to its type to create the correct data structure
           */
          const transformedFormData = propertiesArray?.reduce((formData, i) => {
            const type = formFields[i].type;
            const marker = formFields[i].marker;
            const value = fieldsData[marker as keyof typeof fieldsData]?.value;
            let newData = {
              marker: marker,
              type: 'string',
              value: value,
            } as {
              marker: string;
              type: string;
              value: string | object;
            };

            /** Handle special field types with specific data structures */
            if (marker === 'spam') {
              newData = {
                marker: marker,
                type: 'spam',
                value: '',
              };
            }
            if (marker === 'send') {
              newData = {
                marker: marker,
                type: 'button',
                value: '',
              };
            }
            if (type === 'list') {
              newData = {
                marker: marker,
                type: 'list',
                value: [value],
              };
              // newData = {
              //   marker: marker,
              //   type: 'list',
              //   value: [
              //     {
              //       title: value,
              //       value: value,
              //     },
              //   ],
              // };
            }
            if (type === 'text') {
              newData = {
                marker: marker,
                type: 'text',
                value: [
                  {
                    // htmlValue: value,
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

          /** Send transformed form data to OneEntry API using hook */
          try {
            const result = await sendData({
              /** Form identifier from CMS data */
              formIdentifier: data?.identifier || '',
              /** Transformed form data */
              formData: transformedFormData,
              /** Form module configuration ID */
              formModuleConfigId: moduleFormConfig?.id || 0,
              /** Module entity identifier */
              moduleEntityIdentifier:
                moduleFormConfig?.entityIdentifiers?.[0]?.id || '',
              /** Reply-to email (not used in this form) */
              replayTo: null,
              /** Initial status of the form submission */
              status: 'sent',
            });

            /** Handle errors from sendData */
            if (result && typeof result === 'object' && 'error' in result) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setError((result as any).error);
              setSuccessMessage('');
            } else if (result && typeof result === 'object') {
              /** Handle successful submission */
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const actionMessage = (result as any).actionMessage;
              if (actionMessage) {
                setSuccessMessage(actionMessage);
              }
              setError('');
              /** Clear form fields */
              dispatch(clearFields());
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            setError(e.message);
            setSuccessMessage('');
          }
        }
      },
      [formFields, fieldsData, data, moduleFormConfig, sendData, dispatch],
    );

    /** Show loader while form data is being fetched */
    if (isLoading) {
      return <Loader />;
    }

    return (
      <form
        className={
          'flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5 ' +
          className
        }
        onSubmit={onSubmitFormHandle}
      >
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {formFields?.map((field: IAttributes, index: Key | number) => {
            /** Render form fields based on their type */
            if (field.type === 'button') {
              return (
                <div key={field.marker || index}>
                  {successMessage && (
                    <div className="mb-4 rounded-md bg-green-50 p-4 text-center text-green-800">
                      {successMessage}
                    </div>
                  )}
                  <FormSubmitButton
                    title={field.localizeInfos.title}
                    isLoading={loading}
                    index={10}
                  />
                </div>
              );
            } else if (field.type === 'spam') {
              return (
                <div key={field.marker || index}>
                  <FormReCaptcha
                    key={field.marker || index}
                    setToken={setToken}
                    setIsCaptcha={setIsCaptcha}
                    siteKey={field.settings?.captcha.key || ''}
                    setIsValid={setIsValid}
                    action={'verify'}
                  />
                </div>
              );
            } else {
              return (
                <FormInput
                  key={field.marker || index}
                  index={index as number}
                  value={field.value}
                  marker={field.marker}
                  type={field.type}
                  localizeInfos={field.localizeInfos}
                  validators={field.validators}
                  listTitles={field.listTitles}
                />
              );
            }
          })}
        </div>

        {(error || !isValid || !token || !isCaptcha) && (
          <ErrorMessage error={error} />
        )}
      </form>
    );
  },
);

ContactUsForm.displayName = 'ContactUsForm';

export default ContactUsForm;
