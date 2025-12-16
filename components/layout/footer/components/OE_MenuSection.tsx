import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

/**
 * Footer section component for displaying OneEntry information and social links.
 * Renders social media icons, Trustpilot review section, and copyright information.
 * @returns {JSX.Element} React component.
 */
const OEMenuSection = (): JSX.Element => {
  /**
   * Get dictionary data from server provider
   * Used to display localized texts
   */
  const [dict] = ServerProvider('dict');

  /** Get current year for copyright information */
  const currentYear = new Date().getFullYear();

  return (
    /**
     * Main footer section container with black background and white text
     * Responsive padding and full width layout
     */
    <div className="w-full gap-3 bg-black px-5 py-11 text-center text-white max-md:max-w-full max-md:p-5">
      {/** Social media links section. Displays Telegram, GitHub, and YouTube icons with links */}
      <div className="mx-auto mb-5 flex justify-center gap-4">
        <Link href="https://t.me/OneEntry_headlesscms" target="blank">
          <Image
            alt="telegram"
            loading="lazy"
            width={21}
            height={21}
            decoding="async"
            src="/icons/tg.svg"
          />
        </Link>
        <Link href="https://github.com/OneEntry" target="blank">
          <Image
            alt="github"
            loading="lazy"
            width={21}
            height={20}
            decoding="async"
            src="/icons/github.svg"
          />
        </Link>
        <Link href="https://youtube.com/@headlesscms-oneentry" target="blank">
          <Image
            alt="youtube"
            loading="lazy"
            width={23}
            height={16}
            decoding="async"
            src="/icons/youtube.svg"
          />
        </Link>
      </div>
      {/** Main content section with three columns layout. Contains Trustpilot review, contact information, and empty column */}
      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-row max-sm:flex-col">
        {/** Trustpilot review section. Displays Trustpilot logo and 5-star rating with link to review page */}
        <div className="flex w-4/12 flex-col max-md:w-4/12 max-sm:w-full">
          <Link
            target="_blank"
            href="https://www.trustpilot.com/review/oneentry.cloud"
            className="flex w-40 flex-col gap-2 rounded-lg bg-white p-3 max-sm:mx-auto max-sm:mb-4"
          >
            <Image
              alt="trustpilot-logo"
              loading="lazy"
              width="130"
              height="21"
              decoding="async"
              src="/icons/trustpilot-logo.svg"
            />
            <Image
              alt="trustpilot-start"
              loading="lazy"
              width="130"
              height="30"
              decoding="async"
              src="/icons/trustpilot-stars-5.svg"
            />
          </Link>
        </div>
        {/** Contact information and copyright section. Displays CMS information, contact email, and copyright notice */}
        <div className="flex w-4/12 flex-col max-md:w-4/12 max-sm:w-full">
          <p className="mb-4 text-lg font-light">
            <b>Content management system</b> OneEntry
          </p>
          <p className="mb-4 font-light">
            If you have any questions or suggestions, contact us by email{' '}
            <a
              href="mailto:questions@oneentry.cloud"
              className="text-orange-500"
            >
              questions@oneentry.cloud
            </a>
          </p>
          <p className="font-thin">
            © {currentYear} {dict.site_name?.value}{' '}
            <a
              className="font-normal text-orange-500"
              href="https://oneentry.cloud"
            >
              {dict.company_name?.value}
            </a>
          </p>
        </div>
        {/** Empty column for layout balance. Reserved for future content or styling purposes */}
        <div className="flex w-4/12 flex-col max-md:w-4/12 max-sm:w-full"></div>
      </div>
    </div>
  );
};

export default OEMenuSection;
