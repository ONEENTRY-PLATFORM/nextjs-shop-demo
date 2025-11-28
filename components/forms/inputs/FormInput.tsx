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
 * @param   {string}              field.value         - Field value.
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
  value: string;
  validators?: Record<string, any>;
  index?: number;
  listTitles?: Record<string, any>;
  localizeInfos?: Record<string, any>;
}): JSX.Element => {
  const { localizeInfos } = field;

  /* State for storing the current value of the input field */
  const [value, setValue] = useState<string>(field.value || '');

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
      {/** Render standard input for all other field types text/password/email... */}
      {type !== 'textarea' && type !== 'list' && (
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
