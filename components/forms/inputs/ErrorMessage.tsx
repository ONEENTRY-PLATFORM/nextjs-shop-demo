import type { JSX } from 'react';

/**
 * Error message.
 *
 * @param props - Component props.
 * @param props.error - Error message.
 *
 * @returns Error message component.
 */
const ErrorMessage = ({ error }: { error: string }): JSX.Element => {
  return <div className="text-center text-sm text-red-500">{error}</div>;
};

export default ErrorMessage;
