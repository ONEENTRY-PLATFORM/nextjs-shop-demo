import React from 'react';

interface FormInputProps {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  placeholder,
  required,
}) => {
  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <label className="text-base text-gray-400">{label}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
        required={required}
      />
    </div>
  );
};

export default FormInput;
