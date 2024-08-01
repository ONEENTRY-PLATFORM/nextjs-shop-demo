import Image from 'next/image';
import React from 'react';

import ContactInfo from './footer/ContactInfo';
import Information from './footer/Information';
import QuickLinks from './footer/QuickLinks';

interface FooterProps {
  logoSrc: string;
}

const FooterMenu: React.FC<FooterProps> = ({ logoSrc }) => {
  return (
    <footer className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:max-w-full max-md:px-5">
      <div className="flex w-[1240px] max-w-full flex-row flex-wrap items-start justify-between gap-16 md:w-full">
        <Image
          loading="lazy"
          src={logoSrc}
          alt="Company logo"
          className="aspect-[3.57] w-[253px] max-w-full shrink-0 max-sm:mb-5"
        />
        <ContactInfo />
        <QuickLinks />
        <Information />
      </div>
    </footer>
  );
};

export default FooterMenu;
