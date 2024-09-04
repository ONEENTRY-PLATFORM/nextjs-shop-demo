import React from 'react';

interface LoaderProps {
  data?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Loader: React.FC<LoaderProps> = ({ data = {} }) => {
  return (
    <div className="relative aspect-square size-full max-h-[550px] overflow-hidden">
      ...Loading
    </div>
  );
};

export default Loader;
