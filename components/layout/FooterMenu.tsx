import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ContactInfo from './footer/ContactInfo';
import FooterMenu from './footer/Menu';

interface FooterProps {
  logoSrc: string;
}

const quickLinks = [
  {
    text: 'About us',
    href: '/about',
  },
  {
    text: 'Service',
    href: '/service',
  },
  {
    text: 'Treatment',
    href: '/treatment',
  },
  {
    text: 'Product',
    href: '/',
  },
  {
    text: 'Our experts',
    href: '/experts',
  },
  {
    text: 'Support',
    href: '/support',
  },
  {
    text: 'Contact',
    href: '/contacts',
  },
];

const infoLinks = [
  {
    text: 'Book online',
    href: '/book',
  },
  {
    text: 'Delivery',
    href: '/delivery',
  },
  {
    text: 'Offers & events',
    href: '/offers',
  },
  {
    text: 'Purchase a gift card',
    href: '/gifts',
  },
  {
    text: 'Pricing & package',
    href: '/package',
  },
  {
    text: 'Payments',
    href: '/payments',
  },
];

const FooterMenuSection: React.FC<FooterProps> = ({ logoSrc }) => {
  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between gap-16">
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
        <FooterMenu title={'Quick Link'} items={quickLinks} />
        <FooterMenu title={'Information'} items={infoLinks} />
      </div>
    </div>
  );
};

export default FooterMenuSection;
