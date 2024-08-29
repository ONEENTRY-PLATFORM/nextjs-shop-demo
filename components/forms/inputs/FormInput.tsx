import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';

interface FormInputProps {
  localizeInfos: {
    title: string;
  };
  placeholder: string;
  marker: string;
  required: boolean;
  fieldType: string;
}

const FormInput: React.FC<FormInputProps> = (field) => {
  const { localizeInfos } = field;
  const [value, setValue] = useState<string>('');
  const dispatch = useAppDispatch();
  const validate = true;

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

  if (!field) {
    return;
  }

  const { fieldType, marker, placeholder, required } = field;

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label className="text-base text-gray-400">{localizeInfos?.title}</label>
      <input
        type={fieldType}
        id={marker}
        placeholder={placeholder}
        className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
        required={required}
        onChange={(val) => setValue(val.currentTarget.value)}
        autoComplete={fieldType === 'password' ? 'password' : ''}
      />
    </div>
  );
};

export default FormInput;
