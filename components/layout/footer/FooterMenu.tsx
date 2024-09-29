import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { getBlockByMarker, getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { SidebarMenuLoader } from '@/components/shared/Loader';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';

const FooterMenuSection: FC = async () => {
  const [lang] = useServerProvider('lang');

  const quickLinks = await getMenuByMarker('quick_links', lang);
  const infoLinks = await getMenuByMarker('information', lang);
  const { block } = await getBlockByMarker('contact_info', lang);

  return (
    <div className="flex w-full items-center justify-center bg-gray-200 px-5 py-10 max-md:px-5">
      <div className="flex w-full max-w-screen-xl flex-row flex-wrap items-start justify-between max-md:justify-start max-md:gap-16 max-sm:gap-6">
        <Link href={'/'} className="max-md:w-full">
          <Image
            src={'/images/logo-250x70.svg'}
            width={250}
            height={70}
            alt="..."
            loading="lazy"
            className="aspect-[3.57] w-[250px] max-w-full shrink-0 max-lg:max-w-[180px] max-sm:mb-5"
          />
        </Link>
        <ContactInfo block={block} lang={lang} />
        {quickLinks.menu ? (
          <FooterMenu menu={quickLinks.menu} lang={lang} />
        ) : (
          <div className="flex w-[21%] flex-col max-lg:w-[21%] max-md:w-1/2 max-sm:w-[45%] max-xs:w-full">
            <h2 className="mb-5 text-xl font-bold">Title</h2>
            <SidebarMenuLoader limit={6} />
          </div>
        )}
        {infoLinks.menu ? (
          <FooterMenu menu={infoLinks.menu} lang={lang} />
        ) : (
          <div className="flex w-[21%] flex-col max-lg:w-[21%] max-md:w-1/2 max-sm:w-[45%] max-xs:w-full">
            <h2 className="mb-5 text-xl font-bold">Title</h2>
            <SidebarMenuLoader limit={6} />
          </div>
        )}
        {/* {quickLinks.menu && <FooterMenu menu={quickLinks.menu} lang={lang} />}
        {infoLinks.menu && <FooterMenu menu={infoLinks.menu} lang={lang} />} */}
      </div>
    </div>
  );
};

export default FooterMenuSection;
