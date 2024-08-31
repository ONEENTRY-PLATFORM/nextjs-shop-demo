import React from 'react';

interface FormSubmitButtonProps {
  title: string;
  icon: string;
  class: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ title }) => {
  return (
    <button
      type="submit"
      className="mt-auto flex w-[282px] max-w-full items-center justify-center self-center rounded-[30px] border border-none border-[black] bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-10 max-md:px-5"
    >
      {title}
    </button>
  );
};

export default FormSubmitButton;
