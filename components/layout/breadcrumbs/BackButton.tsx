'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      className="flex size-[50px] min-w-[50px] items-center justify-center rounded-3xl border border-solid border-gray-400 bg-white"
      aria-label="Go back"
      onClick={() => router.back()}
    >
      <Image
        loading="lazy"
        src="/icons/arrow-back.svg"
        width={26}
        height={26}
        className="aspect-square w-[26px] fill-neutral-600"
        alt=""
      />
    </button>
  );
};

export default BackButton;
