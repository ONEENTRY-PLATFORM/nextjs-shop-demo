import { Baloo_2 as Baloo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import LogoWhite from '@/components/layout/footer/components/LogoWhite';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';
import { VerticalMenuLoader } from './VerticalMenuLoader';

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

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
    <div
      className={
        baloo.className +
        'flex w-full items-center justify-center bg-[#4d4b4d] px-5 py-10 max-md:px-5'
      }
    >
      <div className="flex relative w-full max-w-screen-xl flex-row flex-wrap items-start justify-start gap-10 max-md:justify-start max-md:gap-16 max-sm:gap-6">
        <Link href={'/' + lang} className="max-md:w-full">
          <LogoWhite />
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
        <Image
          src={'/images/dog.svg'}
          width={250}
          height={70}
          alt="..."
          loading="lazy"
          className=" h-full absolute left-0 top-0 shrink-0 max-lg:max-w-[180px] max-sm:mb-5"
        />
      </div>
    </div>
  );
};

export default FooterMenuSection;
