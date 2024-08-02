import React from 'react';

const ViewAllButton: React.FC = () => {
  return (
    <button
      type="button"
      className="mt-5 self-end rounded-[30px] border border-solid border-orange-500 px-16 py-4 max-md:px-5"
    >
      View all reviews
    </button>
  );
};

export default ViewAllButton;
