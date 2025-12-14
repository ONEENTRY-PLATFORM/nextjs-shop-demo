'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { memo, useCallback, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
// import FormCaptcha from './inputs/FormCaptcha';
// import FormReCaptcha from './inputs/FormReCaptcha';

/**
 * ContactUs form.
 * @param   {object}      props           - ContactUs form props
 * @param   {string}      props.className - CSS className of ref element
 * @param   {string}      props.lang      - Current language shortcode
 * @returns {JSX.Element}                 ContactUs form component
 */
const ContactUsForm = memo(
  ({ className, lang }: { className?: string; lang: string }): JSX.Element => {
    // const [token, setToken] = useState<string | null>();
    // const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
    /** Loading state for form submission */
    const [loading, setLoading] = useState<boolean>(false);

    /** Error state for form submission errors */
    const [error, setError] = useState<string>('');

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
     * Sort form fields by position attribute
     * This ensures fields are displayed in the correct order
     */
    const formFields = data?.attributes
      .slice()
      .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

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

        // transform and send form data
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

            /**
             * Handle special field types with specific data structures
             */
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

          /**
           * Send transformed form data to OneEntry API
           */
          try {
            setLoading(true);
            await api.FormData.postFormsData({
              /**
               * Form identifier from CMS data
               */
              formIdentifier: data?.identifier || '',
              /**
               * Transformed form data
               */
              formData: transformedFormData,
              /**
               * Form module configuration ID
               */
              formModuleConfigId: moduleFormConfig?.id || 0,
              /**
               * Module entity identifier
               */
              moduleEntityIdentifier:
                moduleFormConfig?.entityIdentifiers?.[0]?.id || '',
              /**
               * Reply-to email (not used in this form)
               */
              replayTo: null,
              /**
               * Initial status of the form submission
               */
              status: 'sent',
            });
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            setLoading(false);
            setError(e.message);
          }
        }
      },
      [formFields, fieldsData, data, moduleFormConfig],
    );

    /**
     * Show loader while form data is being fetched
     */
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
            /**
             * Render form fields based on their type
             */
            if (field.type === 'button') {
              return (
                <FormSubmitButton
                  key={index}
                  title={field.localizeInfos.title}
                  isLoading={loading}
                  index={10}
                />
              );
            } else if (field.type === 'spam') {
              return (
                <div key={index}>
                  {/* <FormCaptcha
                  setToken={setToken}
                  setIsCaptcha={setIsCaptcha}
                  captchaKey={field.settings?.captchaKey || ''}
                /> */}
                  {/* <FormReCaptcha
                  setToken={setToken}
                  setIsCaptcha={setIsCaptcha}
                  captchaKey={field.settings?.captchaKey || ''}
                /> */}
                </div>
              );
            } else {
              return (
                <FormInput
                  key={index}
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

        {error && <ErrorMessage error={error} />}
      </form>
    );
  },
);

ContactUsForm.displayName = 'ContactUsForm';

export default ContactUsForm;
