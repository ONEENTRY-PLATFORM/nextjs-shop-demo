import type { JSX } from 'react';

import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import Spinner from '@/components/shared/Spinner';

/**
 * Form submit button component.
 * Renders a styled submit button with loading state indication.
 * @param   {object}      props           - Form submit button props.
 * @param   {string}      props.title     - Button title text.
 * @param   {boolean}     props.isLoading - Loading state indicator.
 * @param   {number}      props.index     - Index of element for animations stagger.
 * @returns {JSX.Element}                 Form submit button.
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
    /**
     * Wrapper for form field animations
     * Provides staggered animation effects based on the index prop
     * Submit button element * Displays a spinner when isLoading is true,
     * otherwise shows the title
     */
    <FormFieldAnimations index={index} className="">
      <button
        // disabled={isLoading}
        type="submit"
        className="slide-up btn btn-lg btn-primary mx-auto mt-auto w-full max-w-70 uppercase max-md:mt-0"
      >
        {isLoading ? <Spinner /> : title}
      </button>
    </FormFieldAnimations>
  );
};

export default FormSubmitButton;
