import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { getMenuByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';

const logo = {
  src: '/images/logo-250x70.svg',
  width: 250,
  height: 70,
  alt: 'OneEntry',
};

const FooterMenuSection: FC<{ lang: string }> = async ({ lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const quickLinks = await getMenuByMarker('quick_links', langCode);
  const infoLinks = await getMenuByMarker('information', langCode);

  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between max-md:justify-start max-md:gap-16 max-sm:gap-6">
        <Link href={'/' + lang + '/'} className="max-md:w-full">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logo.alt}
            loading="lazy"
            className="aspect-[3.57] w-[250px] max-w-full shrink-0 max-lg:max-w-[180px] max-sm:mb-5"
          />
        </Link>
        <ContactInfo />
        {quickLinks.menu && <FooterMenu menu={quickLinks.menu} lang={lang} />}
        {infoLinks.menu && <FooterMenu menu={infoLinks.menu} lang={lang} />}
      </div>
    </div>
  );
};

export default FooterMenuSection;
