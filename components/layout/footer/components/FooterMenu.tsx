import { Baloo_2 as Baloo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import LogoWhite from '@/components/layout/footer/components/LogoWhite';

import ContactInfo from './ContactInfo';
import FooterMenu from './Menu';
import VerticalMenuLoader from './VerticalMenuLoader';

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

/**
 * Footer menu section component for rendering the main footer content.
 * Displays logo, contact information, and navigation menus in the footer.
 * @returns {Promise<JSX.Element>} Footer menu section.
 */
const FooterMenuSection = async (): Promise<JSX.Element> => {
  /**
   * Get current language from server provider
   * Used to fetch localized menu content
   */
  const [lang] = ServerProvider('lang');

  /**
   * Fetch quick links menu by marker
   * Retrieves navigation links for quick access section
   */
  const quickLinks = await getMenuByMarker('quick_links', lang);

  /**
   * Fetch information links menu by marker
   * Retrieves navigation links for information section
   */
  const infoLinks = await getMenuByMarker('information', lang);

  return (
    /**
     * Main footer container with background color and padding
     * Uses Baloo font for styling and responsive padding
     */
    <div
      className={
        baloo.className +
        ' flex w-full overflow-hidden items-center justify-center bg-[#4d4b4d] px-5 py-10 max-md:px-5'
      }
    >
      {/** Inner container with maximum width and flex layout. Arranges footer content in a responsive grid-like structure */}
      <div className="relative mx-auto flex w-full max-w-(--breakpoint-xl) flex-row flex-wrap items-start justify-start gap-8 max-md:justify-start max-md:gap-8 max-sm:gap-6">
        {/** Logo section with brand logo and decorative dog image. Links back to the homepage and displays decorative SVG */}
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
            className="relative z-10 -my-10 h-full shrink-0 max-md:my-0 max-sm:mb-5"
          />
        </div>
        {/** Contact information component. Displays company contact details like address, phones, and emails */}
        <ContactInfo />
        {/** Quick links menu section. Displays navigation links or a loader if data is not available */}
        {!quickLinks.isError && quickLinks.menu ? (
          <FooterMenu menu={quickLinks.menu as IMenusEntity} />
        ) : (
          <VerticalMenuLoader limit={6} />
        )}
        {/** Information links menu section. Displays informational navigation links or a loader if data is not available */}
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
