import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

interface FormInputProps {
  localizeInfos: {
    title: string;
  };
  marker: string;
}

const FormInput: React.FC<FormInputProps> = (field) => {
  const { localizeInfos } = field;
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<string>('');
  const dispatch = useAppDispatch();
  const validate = true;

  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[field.marker];
  const minLength = (FormFieldsEnum as unknown as FormFieldsEnum)[field.marker];
  const maxLength = (FormFieldsEnum as unknown as FormFieldsEnum)[field.marker];

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

  if (!field) {
    return;
  }

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label htmlFor={field.marker} className="text-base text-gray-400">
        {localizeInfos?.title}
      </label>
      <input
        type={type}
        id={field.marker}
        placeholder={localizeInfos?.title}
        className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
        required={true}
        onChange={(val) => setValue(val.currentTarget.value)}
        autoComplete={fieldType === 'password' ? 'password' : ''}
        minLength={minLength || 0}
        maxLength={maxLength || 50}
      />
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
