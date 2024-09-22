import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

const FormInput: FC<IAttributes & { value?: string }> = (field) => {
  const { localizeInfos } = field;
  const [value, setValue] = useState<string>(field.value || '');
  const [type, setType] = useState<string>('');
  const dispatch = useAppDispatch();
  const validate = true;

  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.type as any
  ];
  const minLength = field.marker === 'card_cvc' ? 3 : 0;
  const maxLength = field.marker === 'card_cvc' ? 3 : 50;

  useEffect(() => {
    dispatch(
      addField({
        [field.marker]: {
          valid: validate,
          value: value,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, validate]);

  useEffect(() => {
    setType(fieldType || 'text');
  }, [fieldType]);

  if (!field || !type) {
    return;
  }

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label htmlFor={field.marker} className="text-base text-gray-400">
        {localizeInfos?.title}
      </label>
      {/* inputType select */}
      {type === 'list' && (
        <select
          id={field.marker}
          className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          required={true}
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
          required={true}
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
          required={true}
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
    </div>
  );
};

export default FormInput;
