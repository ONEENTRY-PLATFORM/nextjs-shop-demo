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
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a84bf9c79c0357aa33fcce085ed597bb207f050b4c4640059695bc7d2a37ed8d?placeholderIfAbsent=true&apiKey=cdcacfb89da8456dbacd6d81e50c9b6f"
        alt=""
        className="my-auto aspect-[0.8] w-4 shrink-0 fill-neutral-600"
      />
    </button>
  );
};

export default DeleteButton;
