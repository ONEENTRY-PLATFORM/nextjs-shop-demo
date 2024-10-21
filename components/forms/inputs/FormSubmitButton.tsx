import type { FC } from 'react';

import FormFieldAnimations from '@/app/animations/FormFieldAnimations';
import Spinner from '@/components/shared/Spinner';

interface FormSubmitButtonProps {
  title: string;
  isLoading: boolean;
  index: number;
}

const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  title,
  isLoading,
  index,
}) => {
  return (
    <FormFieldAnimations index={index} className="">
      <button
        disabled={isLoading}
        type="submit"
        className="slide-up btn btn-lg btn-primary mx-auto mt-auto w-full max-w-[280px] uppercase max-md:mt-0"
      >
        {isLoading ? <Spinner /> : title}
      </button>
    </FormFieldAnimations>
  );
};

export default FormSubmitButton;
