import type { JSX } from 'react';

import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import Spinner from '@/components/shared/Spinner';

/**
 * Form submit button props.
 *
 * @param {string} title - Button title.
 * @param {boolean} isLoading - Loading state.
 * @param {number} index - Index of element for animations stagger.
 */
interface FormSubmitButtonProps {
  title: string;
  isLoading: boolean;
  index: number;
}

/**
 * Form submit button.
 *
 * @param {FormSubmitButtonProps} props - Form submit button props.
 * @param {string} props.title - button title.
 * @param {boolean} props.isLoading - loading state.
 * @param {number} props.index - Index of element for animations stagger.
 *
 * @returns Form submit button.
 */
const FormSubmitButton = ({
  title,
  isLoading,
  index,
}: FormSubmitButtonProps): JSX.Element => {
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
