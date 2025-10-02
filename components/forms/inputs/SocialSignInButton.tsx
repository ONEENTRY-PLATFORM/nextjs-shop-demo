import Image from 'next/image';
import type { JSX } from 'react';
import React from 'react';

interface SocialSignInButtonProps {
  imageSrc: string;
  alt: string;
}

/**
 * Social SignIn button.
 *
 * @param {string} props.imageSrc - icon url.
 * @param {string} props.lang - Current language shortcode.
 *
 * @returns Social SignIn button.
 */
const SocialSignInButton = ({
  imageSrc,
  alt,
}: SocialSignInButtonProps): JSX.Element => {
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
