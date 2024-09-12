import React from 'react';

const ViewAllButton: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full">
      <button
        type="button"
        className="mt-5 self-end rounded-[30px] border border-solid border-orange-500 px-16 py-4 uppercase text-orange-500 max-md:self-center max-md:px-6 max-md:py-3"
      >
        View all reviews
      </button>
    </div>
  );
};

export default ViewAllButton;
