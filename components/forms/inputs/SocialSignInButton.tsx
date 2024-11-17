import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';

interface SocialSignInButtonProps {
  imageSrc: string;
  alt: string;
}

/**
 * Social SignIn button
 * @param imageSrc icon url
 * @param lang Current language shortcode
 *
 * @returns Social SignIn button
 */
const SocialSignInButton: FC<SocialSignInButtonProps> = ({ imageSrc, alt }) => {
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
