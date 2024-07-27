import React from 'react';

interface FormSubmitButtonProps {
  text: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ text }) => {
  return (
    <button
      type="submit"
      className="flex justify-center items-center self-center px-5 py-4 mt-auto max-w-full text-base font-medium text-white uppercase bg-orange-500 border border-none border-[black] rounded-[30px] w-[282px] max-md:px-5 max-md:mt-10"
    >
      {text}
    </button>
  );
};

export default FormSubmitButton;