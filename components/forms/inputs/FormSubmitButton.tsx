import type { JSX } from 'react';

import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import Spinner from '@/components/shared/Spinner';

/**
 * Form submit button.
 *
 * @param props - Form submit button props.
 * @param props.title - button title.
 * @param props.isLoading - loading state.
 * @param props.index - Index of element for animations stagger.
 *
 * @returns Form submit button.
 */
const FormSubmitButton = ({
  title,
  isLoading,
  index,
}: {
  title: string;
  isLoading: boolean;
  index: number;
}): JSX.Element => {
  return (
    <FormFieldAnimations index={index} className="">
      <button
        // disabled={isLoading}
        type="submit"
        className="slide-up btn btn-lg btn-primary mx-auto mt-auto w-full max-w-[280px] uppercase max-md:mt-0"
      >
        {isLoading ? <Spinner /> : title}
      </button>
    </FormFieldAnimations>
  );
};

export default FormSubmitButton;
