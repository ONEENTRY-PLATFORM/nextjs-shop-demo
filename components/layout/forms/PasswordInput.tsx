import React from 'react';

interface PasswordInputProps {
  label: string;
  name: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, name }) => {
  return (
    <div className="box-border flex relative flex-col shrink-0">
      <label htmlFor={name} className="text-base text-gray-400">
        {label}
      </label>
      <input
        type="password"
        id={name}
        name={name}
        className="relative py-3 text-base leading-5 border-b border-solid border-[none] border-b-stone-300"
      />
    </div>
  );
};

export default PasswordInput;