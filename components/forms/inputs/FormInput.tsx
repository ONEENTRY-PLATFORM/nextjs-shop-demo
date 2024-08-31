import React, { useEffect, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import EyeIcon from '@/components/icons/eye';

interface FormInputProps {
  localizeInfos: {
    title: string;
  };
  marker: string;
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

  const fieldType = (FormFieldsEnum as unknown as FormFieldsEnum)[field.marker];
  // {
  //   if(password.type === "password") {
  //     password.type = "text";
  //     icon.classList.add("fa-eye-slash");
  //     icon.classList.remove("fa-eye");
  //   }
  //   else {
  //     password.type = "password";
  //     icon.classList.add("fa-eye");
  //     icon.classList.remove("fa-eye-slash");
  //   }
  // }
  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label className="text-base text-gray-400">{localizeInfos?.title}</label>
      <input
        type={fieldType}
        id={field.marker}
        placeholder={localizeInfos?.title}
        className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
        required={true}
        onChange={(val) => setValue(val.currentTarget.value)}
        autoComplete={fieldType === 'password' ? 'password' : ''}
      />
      {fieldType === 'password' && (
        <div className="absolute bottom-2 right-2">
          <EyeIcon />
        </div>
      )}
    </div>
  );
};

export default FormInput;
