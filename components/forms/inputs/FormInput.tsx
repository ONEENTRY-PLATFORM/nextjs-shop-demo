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

/**
 * FormInput component for rendering various types of form fields.
 * Handles text inputs, textareas, select dropdowns, and password fields with show/hide functionality.
 * @param   {object}              field               - Field properties.
 * @param   {string | number}     field.value         - Field value.
 * @param   {string}              field.marker        - Field marker.
 * @param   {string}              field.type          - Field type.
 * @param   {Record<string, any>} field.validators    - Field validators.
 * @param   {number}              field.index         - Field index.
 * @param   {Record<string, any>} field.listTitles    - List titles.
 * @param   {Record<string, any>} field.localizeInfos - Localize info.
 * @returns {JSX.Element}                             Form input.
 */
const FormInput = (field: {
  marker: string;
  type: string;
  value: string | number;
  validators?: Record<string, any>;
  index?: number;
  listTitles?: Record<string, any>;
  localizeInfos?: Record<string, any>;
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

  return (
    <FormFieldAnimations index={field.index as number} className="input-group">
      {/** Label for the form field * Shows an asterisk if the field is required */}
      <label htmlFor={field.marker} className="text-gray-400">
        {localizeInfos?.title}{' '}
        {required && <span className="text-red-500">*</span>}
      </label>
      {/** Render select dropdown for list type fields */}
      {type === 'list' && (
        <select
          id={field.marker}
          className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
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
      {type === 'textarea' && (
        <textarea
          id={field.marker}
          placeholder={localizeInfos?.title}
          className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          required={required}
          onChange={(val) => setValue(val.currentTarget.value)}
          value={value}
        />
      )}
      {/** Render groupOfImages type field */}
      {type === 'groupOfImages' && (
        <input
          type="file"
          id={field.marker}
          placeholder={localizeInfos?.title}
          className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          required={required}
          onChange={(val) => setValue(val.currentTarget.value)}
          value={value}
        />
      )}
      {/** Render 5 stars, filling them based on the rating value */}
      {field.marker === 'rating' && (
        <div className="flex shrink-0 flex-row items-center gap-1.5 ">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className="my-auto aspect-square w-[25px] shrink-0 self-start cursor-pointer"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onMouseEnter={() => setValue(index + 1)}
              onClick={() => setValue(index + 1)}
            >
              {/** Star shape path with dynamic fill/stroke based on rating */}
              <path
                d="M8.38585 1.08182L9.56768 4.71911C9.76849 5.33714 10.3444 5.75558 10.9943 5.75558H14.8187C15.3031 5.75558 15.5045 6.37539 15.1126 6.66009L12.0186 8.90806C11.4928 9.29002 11.2728 9.96707 11.4737 10.5851L12.6555 14.2224C12.8052 14.6831 12.2779 15.0661 11.8861 14.7814L8.792 12.5334C8.26627 12.1515 7.55438 12.1515 7.02865 12.5334L3.93459 14.7814C3.54273 15.0661 3.01549 14.683 3.16517 14.2224L4.34699 10.5851C4.5478 9.96707 4.32782 9.29002 3.80208 8.90806L0.708024 6.66009C0.316167 6.37539 0.517556 5.75558 1.00192 5.75558H4.82639C5.47622 5.75558 6.05216 5.33714 6.25297 4.71911L7.4348 1.08182C7.58447 0.621163 8.23618 0.621166 8.38585 1.08182Z"
                stroke={Number(value) <= index ? '#EC722B' : ''}
                fill={Number(value) > index ? '#EC722B' : ''}
              />
            </svg>
          ))}
          <input
            type={type}
            id={field.marker}
            className="hidden"
            required={required}
            onChange={(val) => setValue(val.currentTarget.value)}
            value={value}
          />
        </div>
      )}
      {/** Render standard input for all other field types text/password/email... */}
      {type !== 'textarea' && type !== 'list' && field.marker !== 'rating' && (
        <input
          type={type}
          id={field.marker}
          placeholder={localizeInfos?.title}
          className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          required={required}
          onChange={(val) => setValue(val.currentTarget.value)}
          autoComplete={fieldType === 'password' ? 'password' : ''}
          minLength={field.validators?.['stringInspectionValidator']?.stringMin}
          maxLength={field.validators?.['stringInspectionValidator']?.stringMax}
          value={value}
        />
      )}
      {/** Render password visibility toggle button for password fields */}
      {fieldType === 'password' && (
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
