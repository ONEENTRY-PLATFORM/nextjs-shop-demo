import React from 'react';

interface FormInputProps {
  label: string;
  placeholder: string;
  name: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, placeholder, name }) => {
  return (
    <div className="box-border flex relative flex-col shrink-0">
      <label htmlFor={name} className="text-base text-gray-400">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        className="relative py-3 text-base leading-5 border-b border-solid border-[none] border-b-stone-300"
      />
    </div>
  );
};

export default FormInput;