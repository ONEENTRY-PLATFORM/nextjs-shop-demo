import Image from 'next/image';
import Link from 'next/link';

import { getMenuByMarker } from '@/app/api/serverSideProps';

// import { infoLinks, quickLinks } from '@/components/data';
import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';

const FooterMenuSection = async () => {
  const quickLinks = await getMenuByMarker({
    marker: 'quick_links',
    langCode: 'en_US',
  });
  const infoLinks = await getMenuByMarker({
    marker: 'information',
    langCode: 'en_US',
  });
  console.log(infoLinks);

  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between gap-16">
        <Link href="/">
          <Image
            loading="lazy"
            src="/images/logo-250x70.svg"
            width={250}
            height={70}
            alt="OneEntry"
            className="aspect-[3.57] w-[253px] max-w-full shrink-0 max-sm:mb-5"
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
