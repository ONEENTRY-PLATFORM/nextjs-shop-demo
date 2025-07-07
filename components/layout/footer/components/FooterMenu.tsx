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
        ' flex w-full overflow-hidden items-center justify-center bg-[#4d4b4d] px-5 py-10 max-md:px-5'
      }
    >
      <div className="relative mx-auto flex max-w-screen-xl flex-row flex-wrap items-start justify-start w-full gap-8 max-md:justify-start max-md:gap-8 max-sm:gap-6">
        {/* Logo */}
        <div className="max-md:w-full">
          <Link href={'/' + lang}>
            <LogoWhite />
          </Link>
          <Image
            src={'/images/dog.svg'}
            width={542}
            height={342}
            alt="..."
            loading="lazy"
            className="relative z-10 -my-10 h-full shrink-0 max-sm:mb-5 max-md:my-0"
          />
        </div>
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
