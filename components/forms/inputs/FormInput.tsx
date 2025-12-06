/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX, Key } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

import StarRating from './StarRating';

/**
 * FormInput component for rendering various types of form fields.
 * Handles text inputs, textareas, select dropdowns, and password fields with show/hide functionality.
 * @param   {object}              field                 - Field properties.
 * @param   {string}              field.marker          - Field marker.
 * @param   {string}              field.type            - Field type.
 * @param   {string | number}     field.value           - Field value.
 * @param   {Record<string, any>} [field.validators]    - Field validators.
 * @param   {number}              [field.index]         - Field index.
 * @param   {Record<string, any>} [field.listTitles]    - List titles.
 * @param   {Record<string, any>} [field.localizeInfos] - Localize info.
 * @param   {string}              [field.className]     - Class name.
 * @returns {JSX.Element}                               Form input.
 */
const FormInput = (field: {
  marker: string;
  type: string;
  value: string | number;
  validators?: Record<string, any>;
  index?: number;
  listTitles?: Record<string, any>;
  localizeInfos?: Record<string, any>;
  className?: string;
}): JSX.Element => {
  const { localizeInfos } = field;

  /* State for storing the current value of the input field */
  const [value, setValue] = useState<string | number>(field.value || '');

  /* State for toggling password visibility (text/password) */
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* Redux dispatch function for updating form field values in the store */
  const dispatch = useAppDispatch();

  /* Validation state (currently always true) */
  const valid = true;

  /**
   * Determine the field type based on marker or provided type
   * Special handling for email and password fields
   */
  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[
    field?.marker?.indexOf('password') !== -1
      ? 'password'
      : field.marker.indexOf('email') !== -1
        ? 'email'
        : (field.type as any)
  ];

  /**
   * Calculate the actual input type
   * For password fields, toggle between 'password' and 'text' based on visibility state
   */
  const type =
    fieldType === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : fieldType || 'text';

  /* Check if the field is required based on validators */
  const required = field?.validators?.['requiredValidator']?.strict || false;

  /* Effect to update the Redux store when field value or validation state changes */
  useEffect(() => {
    dispatch(
      addField({
        [field.marker]: {
          valid: valid,
          value: value,
        },
      }),
    );
  }, [value, valid, field.marker, dispatch]);

  /* Return empty element if field or type is not defined */
  if (!field || !type) {
    return <></>;
  }

  const defaultClassName =
    'relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800';

  const cn = field.className || defaultClassName;

  return (
    <FormFieldAnimations index={field.index as number} className="input-group">
      {/** Label for the form field * Shows an asterisk if the field is required */}
      <label htmlFor={field.marker} className="text-gray-400">
        {localizeInfos?.title}{' '}
        {required && <span className="text-red-500">*</span>}
      </label>
      {/** Render select dropdown for list type fields */}
      {field.type === 'list' && (
        <select
          id={field.marker}
          className={cn}
          required={required}
          value={value}
          onChange={(val) => setValue(val.currentTarget.value)}
        >
          {field.listTitles?.map(
            (
              option: {
                value: string;
                title:
                  | string
                  | number
                  | bigint
                  | boolean
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<unknown>
                  | null
                  | undefined;
              },
              i: Key,
            ) => {
              return (
                <option key={i} value={option.value as string}>
                  {option.title as string}
                </option>
              );
            },
          )}
        </select>
      )}
      {/** Render textarea for textarea type fields */}
      {field.type === 'textarea' && (
        <textarea
          id={field.marker}
          placeholder={localizeInfos?.title}
          className={cn}
          required={required}
          onChange={(val) => setValue(val.currentTarget.value)}
          value={value}
        />
      )}
      {/** Render groupOfImages type field */}
      {field.type === 'groupOfImages' && (
        <div className={'flex items-center gap-4 ' + cn}>
          <svg
            width="38"
            height="33"
            viewBox="0 0 38 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M37.5 8.75C37.5 7.755 37.105 6.80125 36.4013 6.09875C35.6988 5.395 34.745 5 33.75 5H29.5225L28.0588 2.07251C27.4238 0.802506 26.125 0 24.705 0C21.8263 0 15.6737 0 12.795 0C11.375 0 10.0762 0.802506 9.44124 2.07251L7.9775 5H3.75C2.755 5 1.80125 5.395 1.09875 6.09875C0.394997 6.80125 0 7.755 0 8.75V28.75C0 29.745 0.394997 30.6988 1.09875 31.4013C1.80125 32.105 2.755 32.5 3.75 32.5H33.75C34.745 32.5 35.6988 32.105 36.4013 31.4013C37.105 30.6988 37.5 29.745 37.5 28.75V8.75ZM2.5 20V28.75C2.5 29.0812 2.63125 29.4 2.86625 29.6338C3.1 29.8688 3.41875 30 3.75 30H33.75C34.0812 30 34.4 29.8688 34.6338 29.6338C34.8688 29.4 35 29.0812 35 28.75V20H27.4113C26.8038 24.2388 23.155 27.5 18.75 27.5C14.345 27.5 10.6962 24.2388 10.0887 20H2.5ZM18.75 12.5C22.2 12.5 25 15.3 25 18.75C25 22.2 22.2 25 18.75 25C15.3 25 12.5 22.2 12.5 18.75C12.5 15.3 15.3 12.5 18.75 12.5ZM35 17.5V8.75C35 8.41875 34.8688 8.1 34.6338 7.86625C34.4 7.63125 34.0812 7.5 33.75 7.5H3.75C3.41875 7.5 3.1 7.63125 2.86625 7.86625C2.63125 8.1 2.5 8.41875 2.5 8.75V17.5H10.0887C10.6962 13.2612 14.345 10 18.75 10C23.155 10 26.8038 13.2612 27.4113 17.5H35ZM6.25 10C6.94 10 7.5 10.56 7.5 11.25C7.5 11.94 6.94 12.5 6.25 12.5C5.56 12.5 5 11.94 5 11.25C5 10.56 5.56 10 6.25 10ZM26.7275 5H10.7725L11.6775 3.19124C11.8887 2.76749 12.3212 2.5 12.795 2.5H24.705C25.1788 2.5 25.6113 2.76749 25.8225 3.19124L26.7275 5Z"
              fill="#B0BCCE"
            />
          </svg>
          <input
            type="file"
            id={field.marker}
            placeholder={localizeInfos?.title}
            // className={cn}
            required={required}
            onChange={(val) => setValue(val.currentTarget.value)}
            value={value}
            multiple
          />
        </div>
      )}
      {/** Render 5 stars rating field  if marker is 'rating' */}
      {field.marker === 'rating' && (
        <StarRating
          value={value}
          setValue={setValue}
          type={type}
          field={field}
          required={required}
        />
      )}
      {/** Render standard input for all other field types text/password/email... */}
      {field.type !== 'textarea' &&
        field.type !== 'list' &&
        field.type !== 'groupOfImages' &&
        field.marker !== 'rating' && (
          <input
            type={type}
            id={field.marker}
            placeholder={localizeInfos?.title}
            className={cn}
            required={required}
            onChange={(val) => setValue(val.currentTarget.value)}
            autoComplete={fieldType === 'password' ? 'password' : ''}
            minLength={
              field.validators?.['stringInspectionValidator']?.stringMin
            }
            maxLength={
              field.validators?.['stringInspectionValidator']?.stringMax
            }
            value={value}
          />
        )}
      {/** Render password visibility toggle button for password fields */}
      {field.type === 'password' && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowPassword((prev) => !prev);
          }}
          className="absolute bottom-2 right-2 flex size-6 items-center"
        >
          {showPassword ? <EyeOpenIcon /> : <EyeIcon />}
        </button>
      )}
    </FormFieldAnimations>
  );
};

export default FormInput;
