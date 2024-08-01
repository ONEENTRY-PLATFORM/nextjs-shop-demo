import React from 'react';

interface SocialSignInButtonProps {
  src: string;
  alt: string;
}

const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({ src, alt }) => {
  return (
    <button type="button">
      <img loading="lazy" src={src} alt={alt} className="shrink-0 aspect-square w-[51px]" />
    </button>
  );
};

export default SocialSignInButton;