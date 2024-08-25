import React from 'react';

interface LoaderProps {
  data?: Record<string, unknown>;
}

const Loader: React.FC<LoaderProps> = ({ data = {} }) => {
  return (
    <div className="relative aspect-square size-full max-h-[550px] overflow-hidden">
      {/* content goes here */}
    </div>
  );
};

export default Loader;
