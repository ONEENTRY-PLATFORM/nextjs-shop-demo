'use client';

import type { IPostFormResponse } from 'oneentry/types';
import type { FormEvent, JSX, Key } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

import { isError, useFormsData, useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearFields } from '@/app/store/reducers/FormFieldsSlice';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormReCaptcha from './inputs/FormReCaptcha';
import FormSubmitButton from './inputs/FormSubmitButton';
import { getFormAttributes } from './utils/getFormAttributes';
import { transformFormField } from './utils/transformFormData';

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
      const attributes = getFormAttributes(data);
      return attributes.length > 0
        ? attributes.sort((a, b) => a.position - b.position)
        : undefined;
    }, [data]);

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

        /** transform and send form data */
        if (formFields) {
          /**
           * A spam (reCAPTCHA) field must be submitted with a captured token —
           * posting without one is guaranteed to fail the server-side captcha
           * validation, so block the submit until the token arrives.
           */
          const spamField = formFields.find(
            (field) => field.type === 'spam' || field.marker === 'spam',
          );
          if (spamField && !token) {
            setError('Captcha verification is not complete yet');
            return;
          }

          /**
           * Transform form data based on field types
           * Each field is processed according to its type (taken from the form
           * attributes) to create the correct data structure; the spam field
           * gets the captured reCAPTCHA token/siteKey object.
           */
          const transformedFormData = formFields.map((field) =>
            transformFormField({
              marker: field.marker,
              type: field.type,
              value: fieldsData[field.marker]?.value,
              captcha: token
                ? {
                    token,
                    siteKey:
                      (field.settings?.captcha as { key?: string } | undefined)
                        ?.key ?? '',
                  }
                : undefined,
            }),
          );

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

            /**
             * The SDK returns errors as an `IError` object (it does not throw),
             * so `catch` only handles unexpected exceptions — inspect the
             * resolved value for an error before treating it as a success.
             * The previous code read a non-existent `.error` field, so the
             * message was always `undefined` and never shown to the user.
             */
            if (isError(result)) {
              setError(getApiErrorMessage(result));
              setSuccessMessage('');
            } else if (result && typeof result === 'object') {
              /** Handle successful submission */
              const { actionMessage } = result as IPostFormResponse;
              if (actionMessage) {
                setSuccessMessage(actionMessage);
              }
              setError('');
              /** Clear form fields */
              dispatch(clearFields());
            }
          } catch (e) {
            setError(getApiErrorMessage(e));
            setSuccessMessage('');
          }
        }
      },
      [
        formFields,
        token,
        fieldsData,
        data,
        moduleFormConfig,
        sendData,
        dispatch,
      ],
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
          {formFields?.map((field, index: Key | number) => {
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
                    // The API omits `title` when the form carries no
                    // localization for the requested language.
                    title={field.localizeInfos.title || 'Submit'}
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
                    siteKey={
                      (field.settings?.captcha as { key?: string } | undefined)
                        ?.key as string
                    }
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
                  {...field}
                  value={(field.value as string | number | undefined) ?? ''}
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
