import React from 'react';

interface FormInputProps {
  localizeInfos: {
    title: string;
  };
  name: string;
  label: string;
  placeholder: string;
  marker: string;
  required: boolean;
}

const FormInput: React.FC<FormInputProps> = (field) => {
  const { localizeInfos } = field;

  if (!field) {
    return;
  }
  // console.log(field);
  const type = 'text';
  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label className="text-base text-gray-400">{localizeInfos.title}</label>
      <input
        type={type}
        // id={name}
        // placeholder={placeholder}
        className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
        // required={required}
      />
    </div>
  );
};

export default FormInput;
