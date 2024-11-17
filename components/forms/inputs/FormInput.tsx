/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

/**
 * FormInput
 * @param value field value
 * @param index Index of element for animations stagger
 *
 * @returns FormInput
 */
const FormInput: FC<IAttributes & { value?: string; index: number }> = (
  field,
) => {
  const { localizeInfos } = field;
  const [value, setValue] = useState<string>(field.value || '');
  const [type, setType] = useState<string>('');
  const dispatch = useAppDispatch();
  const valid = true;

  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[
    field.marker.indexOf('password') !== -1
      ? 'password'
      : field.marker.indexOf('email') !== -1
        ? 'email'
        : (field.type as any)
  ];

  const required = field.validators['requiredValidator']?.strict || false;
  const minLength =
    field.marker === 'card_cvc'
      ? 3
      : field.validators['stringInspectionValidator']?.stringMin;
  const maxLength =
    field.marker === 'card_cvc'
      ? 3
      : field.validators['stringInspectionValidator']?.stringMax;

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
    return;
  }

  return (
    <FormFieldAnimations index={field.index} className="input-group">
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
          {field.listTitles.map((option, i: Key) => {
            return (
              <option key={i} value={option.value as string}>
                {option.title}
              </option>
            );
          })}
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
          minLength={minLength}
          maxLength={maxLength}
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
