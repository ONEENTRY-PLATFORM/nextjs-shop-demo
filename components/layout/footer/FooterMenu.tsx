import Image from 'next/image';
import Link from 'next/link';

import { infoLinks, quickLinks } from '@/components/data';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';

interface FooterProps {
  logoSrc: string;
}

const FooterMenuSection: React.FC<FooterProps> = ({ logoSrc }) => {
  // quick_links
  // info_links

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
