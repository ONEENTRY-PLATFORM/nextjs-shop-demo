import Image from 'next/image';
import type { JSX } from 'react';

/**
 * Social SignIn button component for OAuth provider login options.
 * Renders a button with an icon representing a social login provider.
 * @param   {object}      props          - Component props.
 * @param   {string}      props.imageSrc - Icon URL for the social provider.
 * @param   {string}      props.alt      - Alt text for the icon image.
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
    /**
     * Button element for social sign in
     * Uses type="button" to prevent form submission
     */
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
