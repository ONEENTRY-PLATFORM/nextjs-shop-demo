/* eslint-disable @next/next/no-img-element */
import React from 'react';

const DeleteButton: React.FC = () => {
  return (
    <button
      className="relative box-border flex w-10 max-w-[40px] shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
    >
      <img
        loading="lazy"
        src="/icons/trash.svg"
        alt=""
        className="my-auto aspect-[0.8] w-4 shrink-0 fill-neutral-600"
      />
    </button>
  );
};

export default DeleteButton;
