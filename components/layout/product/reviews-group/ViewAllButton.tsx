import React from 'react';

const ViewAllButton: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full">
      <button
        type="button"
        className="btn btn-o btn-lg mt-5 self-end max-md:self-center"
      >
        View all reviews
      </button>
    </div>
  );
};

export default ViewAllButton;
