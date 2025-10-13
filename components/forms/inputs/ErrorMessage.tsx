import type { JSX } from 'react';

/**
 * Error message component for displaying form validation or submission errors.
 * @param   {object}      props       - Component props.
 * @param   {string}      props.error - Error message.
 * @returns {JSX.Element}             Error message component.
 */
const ErrorMessage = ({ error }: { error: string }): JSX.Element => {
  /* Render error message with centered text and red color for visibility */
  return <div className="text-center text-sm text-red-500">{error}</div>;
};

export default ErrorMessage;
