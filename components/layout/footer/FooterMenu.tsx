import Image from 'next/image';
import Link from 'next/link';

import { getMenuByMarker } from '@/app/api/serverSideProps';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';

const logo = {
  src: '/images/logo-250x70.svg',
  width: 250,
  height: 70,
  alt: 'OneEntry',
};

const FooterMenuSection = async () => {
  const quickLinks = await getMenuByMarker({
    marker: 'quick_links',
    langCode: 'en_US',
  });
  const infoLinks = await getMenuByMarker({
    marker: 'information',
    langCode: 'en_US',
  });

  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between max-md:justify-start max-md:gap-16 max-sm:gap-6">
        <Link href="/" className="max-md:w-full">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logo.alt}
            loading="lazy"
            className="aspect-[3.57] w-[253px] max-w-full max-lg:max-w-[180px] shrink-0 max-sm:mb-5"
          />
        </Link>
        <ContactInfo />
        {quickLinks.menu && <FooterMenu menu={quickLinks.menu} />}
        {infoLinks.menu && <FooterMenu menu={infoLinks.menu} />}
      </div>
    </div>
  );
};

export default FooterMenuSection;
