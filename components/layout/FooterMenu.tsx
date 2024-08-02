import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ContactInfo from './footer/ContactInfo';
import Information from './footer/Information';
import QuickLinks from './footer/QuickLinks';

interface FooterProps {
  logoSrc: string;
}

const FooterMenu: React.FC<FooterProps> = ({ logoSrc }) => {
  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex max-w-[1240px] flex-row flex-wrap items-start justify-between gap-16 w-full">
        <Link href="/">
          <Image
            loading="lazy"
            src={logoSrc}
            width={250}
            height={70}
            alt="OneEntry"
            className="aspect-[3.57] w-[253px] max-w-full shrink-0 max-sm:mb-5"
          />
        </Link>
        <ContactInfo />
        <QuickLinks />
        <Information />
      </div>
    </div>
  );
};

export default FooterMenu;
