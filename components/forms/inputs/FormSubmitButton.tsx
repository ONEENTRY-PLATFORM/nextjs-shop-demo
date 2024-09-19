import type { FC } from 'react';

import Spinner from '@/components/shared/Spinner';

interface FormSubmitButtonProps {
  title: string;
  isLoading: boolean;
}

const FormSubmitButton: FC<FormSubmitButtonProps> = ({ title, isLoading }) => {
  return (
    <button
      disabled={isLoading}
      type="submit"
      className="btn btn-lg btn-primary mx-auto mt-auto w-[280px] max-md:mt-0"
    >
      {isLoading ? <Spinner /> : title}
    </button>
  );
};

export default FormSubmitButton;
