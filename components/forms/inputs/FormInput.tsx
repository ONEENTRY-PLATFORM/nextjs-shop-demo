/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX, Key } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

/**
 * FormInput.
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
  const [value, setValue] = useState<string>(field.value || '');
  const [type, setType] = useState<string>('');
  const dispatch = useAppDispatch();
  const valid = true;

  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[
    field?.marker?.indexOf('password') !== -1
      ? 'password'
      : field.marker.indexOf('email') !== -1
        ? 'email'
        : (field.type as any)
  ];

  const required = field?.validators?.['requiredValidator']?.strict || false;

  useEffect(() => {
    dispatch(
      addField({
        [field.marker]: {
          valid: valid,
          value: value,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, valid]);

  useEffect(() => {
    setType(fieldType || 'text');
  }, [fieldType]);

  if (!field || !type) {
    return <></>;
  }

  return (
    <FormFieldAnimations index={field.index as number} className="input-group">
      <label htmlFor={field.marker} className="text-gray-400">
        {localizeInfos?.title}{' '}
        {required && <span className="text-red-500">*</span>}
      </label>
      {/* inputType select */}
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
      {/* inputType textarea */}
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
      {/* inputType text/password/email... */}
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
      {/* password button */}
      {fieldType === 'password' && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (type === 'password') {
              setType('text');
            } else {
              setType('password');
            }
          }}
          className="absolute bottom-2 right-2 flex size-6 items-center"
        >
          {type === 'password' ? <EyeIcon /> : <EyeOpenIcon />}
        </button>
      )}
    </FormFieldAnimations>
  );
};

export default FormInput;
