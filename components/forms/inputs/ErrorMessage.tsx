import type { FC } from 'react';

const ErrorMessage: FC<{ error: string }> = ({ error }) => {
  return <div className="text-center text-sm text-red-500">{error}</div>;
};

export default ErrorMessage;
