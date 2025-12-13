/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import type { IAttributes, IAttributeValues } from 'oneentry/dist/base/utils';
// import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FormEvent, Key } from 'react';
import { type JSX, memo, useContext, useState } from 'react';

// import { toast } from 'react-toastify';
import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

// import { AuthContext } from '@/app/store/providers/AuthContext';
// import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FormAnimations from './animations/FormAnimations';
import FormFieldAnimations from './animations/FormFieldAnimations';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const ReviewForm = memo(
  ({
    lang,
    // dict,
  }: {
    lang: string;
    dict: IAttributeValues;
  }): JSX.Element => {
    // const { authenticate } = useContext(AuthContext);
    const { setOpen, data: productData } = useContext(OpenDrawerContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [response, setResponse] = useState<any>(null);

    // const { sign_in_text } = dict;

    /** Get form by marker with RTK */
    const { data, isLoading } = useGetFormByMarkerQuery({
      marker: 'comment_to_product',
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

    const onLeaveReview = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      /** transform and send form data */
      if (formFields) {
        /** Get all form field property keys */
        const propertiesArray = Object.keys(formFields);

        /**
         * Transform form data based on field types
         * Each field is processed according to its type to create the correct data structure
         */
        const transformedFormData = [];
        for (const i of propertiesArray) {
          const type = formFields[i].type;
          const marker = formFields[i].marker;
          const value = fieldsData[marker as keyof typeof fieldsData]?.value;
          let newData = {
            marker: marker,
            type: type,
            value: value,
          } as {
            marker: string;
            type: string;
            value: string | number | object | File[];
            fileQuery?: { type: string; entity: string; id: number };
          };

          /** Handle special field types with specific data structures */
          if (marker === 'spam') {
            newData = {
              marker: marker,
              type: 'spam',
              value: '',
            };
          }
          /** button */
          if (marker === 'send') {
            newData = {
              marker: marker,
              type: 'button',
              value: '',
            };
          }
          /** text */
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
          /** groupOfImages */
          if (type === 'groupOfImages') {
            // /files/project/{type}/{productData.id}/{entity}/file.png
            newData = {
              marker: marker,
              type: 'groupOfImages',
              value: value || [],
              fileQuery: {
                type: 'catalog',
                entity: 'editor',
                id: productData.id,
              },
            };
          }

          if (newData) {
            transformedFormData.push(newData);
          }
        }

        /** Send transformed form data to OneEntry API */
        try {
          setLoading(true);

          const rersponse = await api.FormData.postFormsData({
            formIdentifier: data?.identifier || '',
            formData: transformedFormData,
            formModuleConfigId: moduleFormConfig?.id || 5,
            moduleEntityIdentifier: productData.id,
            replayTo: null,
            status: 'approved',
          });
          setLoading(false);
          setResponse(rersponse);
          setTimeout(() => {
            setOpen(false);
          }, 500);
        } catch (e: any) {
          setLoading(false);
          setError(e.message);
        }
      }
    };

    if (!productData || !data) {
      return <>Error. Some data not found.</>;
    }

    const title = productData.localizeInfos?.title;

    return (
      <FormAnimations isLoading={isLoading || !formFields}>
        <form
          className="mx-auto flex min-h-full w-full max-w-107.5 flex-col gap-4 text-xl leading-5"
          onSubmit={(e) => onLeaveReview(e)}
        >
          {/* Product info */}
          <div className="relative box-border flex shrink-0 flex-col gap-2.5">
            <FormFieldAnimations
              index={0}
              className="max-w-full text-xl items-center font-bold text-neutral-600 flex gap-4"
            >
              {/* Product image */}
              <Image
                src={productData.attributeValues?.pic.value.downloadLink}
                alt={title}
                width={80}
                height={90}
                className="min-h-22.5 min-w-20 object-cover"
              />
              {/* Product title */}
              <h2>{title}</h2>
            </FormFieldAnimations>
          </div>
          {/* Form fields map */}
          <div className="relative mb-4 box-border flex shrink-0 flex-col gap-4">
            {formFields?.map(
              (field: IAttributes & { value: any }, index: Key | number) => {
                return (
                  <FormInput
                    key={index}
                    index={index as number}
                    {...field}
                    className="border border-solid mt-2.5 min-h-20 rounded-[20px] p-5 border-gray-300 cursor-pointer"
                  />
                );
              },
            )}
          </div>
          {/* Submit button */}
          <FormSubmitButton
            index={5}
            title={'Leave review'}
            isLoading={loading}
          />
          {/* Error message */}
          {error && <ErrorMessage error={error} />}
          <div className="text-center">{response?.actionMessage}</div>
        </form>
      </FormAnimations>
    );
  },
);

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;
