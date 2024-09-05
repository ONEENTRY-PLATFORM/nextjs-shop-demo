import React from 'react';

import Spinner from '@/components/shared/Spinner';

interface FormSubmitButtonProps {
  title: string;
  icon: string;
  class: string;
  isLoading: boolean;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  title,
  isLoading,
}) => {
  return (
    <button
      disabled={isLoading}
      type="submit"
      className="mx-auto mt-auto flex w-[280px] max-w-full items-center justify-center self-center rounded-[30px] border-none bg-orange-500 px-5 py-4 text-base font-medium uppercase text-white max-md:mt-0 max-md:px-5"
    >
      {isLoading ? <Spinner /> : title}
    </button>
  );
};

export default FormSubmitButton;
