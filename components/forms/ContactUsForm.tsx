'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FormEvent, JSX, Key } from 'react';
import { memo, useCallback, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
// import FormCaptcha from './inputs/FormCaptcha';
import FormInput from './inputs/FormInput';
// import FormReCaptcha from './inputs/FormReCaptcha';
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
    // const [token, setToken] = useState<string | null>();
    // const [isCaptcha, setIsCaptcha] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Get form by marker with RTK
    const { data, isLoading } = useGetFormByMarkerQuery({
      marker: 'contact_us',
      lang,
    });

    // get fields from formFieldsReducer
    const fieldsData = useAppSelector(
      (state) => state.formFieldsReducer.fields,
    );

    // sort fields by position
    const formFields = data?.attributes
      .slice()
      .sort((a: IAttributes, b: IAttributes) => a.position - b.position);

    const moduleFormConfig = data?.moduleFormConfigs?.[0];

    // Submit form
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
          // transform form data
          const propertiesArray = Object.keys(formFields);
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

          // send form data to API
          try {
            setLoading(true);
            await api.FormData.postFormsData({
              formIdentifier: data?.identifier || '',
              formData: transformedFormData,
              formModuleConfigId: moduleFormConfig?.id || 0,
              moduleEntityIdentifier:
                moduleFormConfig?.entityIdentifiers?.[0]?.id || '',
              replayTo: null,
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

    if (isLoading) {
      return <Loader />;
    }

    return (
      <form
        className={
          'flex min-h-full w-full max-w-[430px] flex-col gap-4 text-xl leading-5 ' +
          className
        }
        onSubmit={onSubmitFormHandle}
      >
        <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
          {formFields?.map((field: IAttributes, index: Key | number) => {
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
