import Image from 'next/image';
import React from 'react';

interface SocialSignInButtonProps {
  imageSrc: string;
  alt: string;
}

const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({
  imageSrc,
  alt,
}) => {
  return (
    <button
      type="button"
      className="relative box-border flex shrink-0 flex-col"
    >
      <Image
        width={30}
        height={30}
        loading="lazy"
        src={imageSrc}
        alt={alt}
        className="aspect-square w-[50px] shrink-0"
      />
    </button>
  );
};

export default SocialSignInButton;
