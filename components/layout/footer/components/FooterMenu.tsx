import Image from 'next/image';
import Link from 'next/link';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';
import { VerticalMenuLoader } from './VerticalMenuLoader';

/**
 * Footer menu section
 * @async
 * @returns Footer menu section
 */
const FooterMenuSection: FC = async () => {
  const [lang] = ServerProvider('lang');
  const quickLinks = await getMenuByMarker('quick_links', lang);
  const infoLinks = await getMenuByMarker('information', lang);

  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between max-md:justify-start max-md:gap-16 max-sm:gap-6">
        <Link href={'/' + lang} className="max-md:w-full">
          <Image
            src={'/images/logo-250x70.svg'}
            width={250}
            height={70}
            alt="..."
            loading="lazy"
            className="aspect-[3.57] w-[250px] max-w-full shrink-0 max-lg:max-w-[180px] max-sm:mb-5"
          />
        </Link>
        <ContactInfo />
        {/* quickLinks menu */}
        {!quickLinks.isError && quickLinks.menu ? (
          <FooterMenu menu={quickLinks.menu as IMenusEntity} />
        ) : (
          <VerticalMenuLoader limit={6} />
        )}
        {/* infoLinks menu */}
        {!infoLinks.isError && infoLinks.menu ? (
          <FooterMenu menu={infoLinks.menu as IMenusEntity} />
        ) : (
          <VerticalMenuLoader limit={6} />
        )}
      </div>
    </div>
  );
};

export default FooterMenuSection;
