import Image from 'next/image';
import type { JSX } from 'react';
import React from 'react';

/**
 * Social SignIn button.
 * @param   {object}      props          - Component props.
 * @param   {string}      props.imageSrc - icon url.
 * @param   {string}      props.alt      - image alt text.
 * @returns {JSX.Element}                Social SignIn button component.
 */
const SocialSignInButton = ({
  imageSrc,
  alt,
}: {
  imageSrc: string;
  alt: string;
}): JSX.Element => {
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
