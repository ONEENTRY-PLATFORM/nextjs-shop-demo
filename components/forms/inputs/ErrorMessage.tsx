import type { JSX } from 'react';

/**
 * Error message
 * @param error error text
 *
 * @returns Error message
 */
const ErrorMessage = ({ error }: { error: string }): JSX.Element => {
  return <div className="text-center text-sm text-red-500">{error}</div>;
};

export default ErrorMessage;
