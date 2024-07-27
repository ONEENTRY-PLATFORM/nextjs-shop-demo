import React from 'react';

interface SocialSignInButtonProps {
  imageSrc: string;
  alt: string;
}

const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({ imageSrc, alt }) => {
  return (
    <button className="box-border flex relative flex-col shrink-0">
      <img loading="lazy" src={imageSrc} alt={alt} className="shrink-0 aspect-square w-[50px]" />
    </button>
  );
};

export default SocialSignInButton;