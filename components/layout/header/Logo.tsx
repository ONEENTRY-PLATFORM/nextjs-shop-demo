import Link from 'next/link';
import type { FC } from 'react';

import LogoIcon from '@/components/icons/logo';

/**
 * Logo
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const Logo: FC<{ lang: string }> = ({ lang }) => {
  return (
    <Link
      href={'/' + lang}
      prefetch={true}
      className="fade-in relative flex h-auto w-full max-w-[240px] items-center outline-none max-lg:max-w-[200px] max-md:max-w-[160px] max-sm:max-w-[120px]"
    >
      <LogoIcon />
    </Link>
  );
};

export default Logo;
