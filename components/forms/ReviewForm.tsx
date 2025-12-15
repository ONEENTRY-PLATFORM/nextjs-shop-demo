'use client';

import Image from 'next/image';
import type {
  IAttributes,
  IAttributeValues,
  IError,
} from 'oneentry/dist/base/utils';
import type {
  FormDataType,
  IPostFormResponse,
} from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { FormEvent, JSX } from 'react';
import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import AuthError from '../pages/AuthError';
import FormAnimations from './animations/FormAnimations';
import FormFieldAnimations from './animations/FormFieldAnimations';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import {
  transformFormField,
  validateFormData,
} from './utils/transformFormData';

// Field value from Redux store
export interface FieldValue {
  value?: unknown;
}

/**
 * ReviewForm component props
 * @property {string}           lang - Language code for localization (e.g., 'en_US', 'ru_RU')
 * @property {IAttributeValues} dict - Dictionary object containing localized strings for UI text
 */
export interface ReviewFormProps {
  /** Language code for form localization */
  lang: string;
  /** Dictionary with localized text strings */
  dict: IAttributeValues;
}

const DEFAULT_MODULE_CONFIG_ID = 5;
const FORM_MARKER = 'comment_to_product';
const FORM_STATUS = 'approved';

/**
 * Review form for submitting product reviews
 * This component renders a comprehensive form that allows authenticated users to submit
 * product reviews with various field types (text, images, ratings, etc.). It fetches form
 * configuration from OneEntry API, handles dynamic form field rendering, validates input,
 * and submits review data.
 * Features:
 * - Dynamic form field generation from API configuration
 * - Authentication check (shows AuthError if user is not logged in)
 * - Multiple field type support (text, textarea, images, ratings, etc.)
 * - Real-time form validation before submission
 * - Automatic field sorting by position
 * - File upload support for review images
 * - Loading states with disabled UI during submission
 * - Success/Error message display
 * - Integration with Redux for form state management
 * - Drawer/Modal integration for UI presentation
 * @param   {ReviewFormProps}  props      - Component props
 * @param   {string}           props.lang - Language code for form localization (e.g., 'en_US', 'ru_RU')
 * @param   {IAttributeValues} props.dict - Dictionary with localized strings (leave_review, error messages, etc.)
 * @returns {JSX.Element}                 Review form component
 * @example
 * ```tsx
 * <ReviewForm
 *   lang="en_US"
 *   dict={localizationDict}
 * />
 * ```
 */
const ReviewForm = memo(({ lang, dict }: ReviewFormProps): JSX.Element => {
  /** Authentication context providing user authentication status and methods */
  const { isAuth } = useContext(AuthContext);
  const { setOpen, data: productData } = useContext(OpenDrawerContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [response, setResponse] = useState<IPostFormResponse | IError | null>(
    null,
  );

  const { form_error_text } = dict;

  /** Get form by marker with RTK */
  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: FORM_MARKER,
    lang,
  });

  /**
   * Get form field values from Redux store
   * These values are updated as the user interacts with form inputs
   */
  const fieldsData = useAppSelector((state) => state.formFieldsReducer.fields);

  /**
   * Sort form fields by position attribute (memoized)
   * This ensures fields are displayed in the correct order
   */
  const formFields = useMemo(() => {
    if (!data?.attributes || !Array.isArray(data.attributes)) {
      return undefined;
    }
    return [...data.attributes].sort(
      (a: IAttributes, b: IAttributes) => a.position - b.position,
    );
  }, [data]);

  /**
   * Get the first module form configuration
   * This contains additional settings for the form submission
   */
  const moduleFormConfig = data?.moduleFormConfigs?.[0];

  /**
   * Handle form submission
   * This function sends the form data to the OneEntry API for processing
   */
  const onLeaveReview = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Clear previous errors
      setError('');

      /** Check if form data is available */
      if (!formFields || !data || !productData) {
        setError('Form data is not available');
        return;
      }

      try {
        /** Transform form data based on field types */
        const transformedFormData: FormDataType[] = formFields.map((field) => {
          const { marker, type } = field;
          const value = fieldsData[marker]?.value;

          return transformFormField({
            marker,
            type,
            value,
            productId: productData.id,
          });
        });

        /** Validate form data before submission */
        const validation = validateFormData(transformedFormData);
        if (!validation.isValid) {
          setError(validation.error || 'Invalid form data');
          return;
        }

        /** Send transformed form data to OneEntry API */
        setLoading(true);

        const responseData = await api.FormData.postFormsData({
          formIdentifier: data.identifier || '',
          formData: transformedFormData,
          formModuleConfigId: moduleFormConfig?.id || DEFAULT_MODULE_CONFIG_ID,
          moduleEntityIdentifier: productData.id,
          replayTo: null,
          status: FORM_STATUS,
        });

        setResponse(responseData);
        setLoading(false);

        // Close drawer and show success message
        setTimeout(() => {
          setOpen(false);
          toast(responseData?.actionMessage || 'Review sent successfully.');
        }, 500);
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to submit review';
        setError(errorMessage);
      }
    },
    [formFields, data, productData, fieldsData, moduleFormConfig, setOpen],
  );

  /** Show authentication error if user is not logged in */
  if (!isAuth) {
    return <AuthError dict={dict} />;
  }

  if (!productData || !data) {
    return form_error_text?.value || 'Error. Some data not found.';
  }

  const title =
    typeof productData.localizeInfos?.title === 'string'
      ? productData.localizeInfos.title
      : productData.localizeInfos?.title?.value || 'Product';

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
          {formFields?.map((field: IAttributes, index: number) => {
            const fieldValue = fieldsData[field.marker]?.value ?? '';
            // Ensure value is string or number (files are handled internally by FormInput)
            const value =
              typeof fieldValue === 'string' || typeof fieldValue === 'number'
                ? fieldValue
                : '';
            return (
              <FormInput
                key={field.marker || index}
                index={index}
                {...field}
                value={value}
                className="border border-solid mt-2.5 min-h-20 rounded-[20px] p-5 border-gray-300 cursor-pointer"
              />
            );
          })}
        </div>
        {/* Submit button */}
        <FormSubmitButton
          index={formFields?.length || 5}
          title={dict.leave_review?.value || 'Leave review'}
          isLoading={loading}
        />
        {/* Error message */}
        {error && <ErrorMessage error={error} />}
        {/* Success message */}
        {response?.actionMessage && (
          <div className="text-center text-green-600">
            {response.actionMessage}
          </div>
        )}
      </form>
    </FormAnimations>
  );
});

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;
