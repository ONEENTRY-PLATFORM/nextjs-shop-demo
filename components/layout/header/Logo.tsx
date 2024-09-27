import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

const Logo: FC<{ lang: string }> = async ({ lang }) => {
  return (
    <Link
      href={'/' + lang}
      prefetch={true}
      className="relative flex h-[83px] w-full max-w-[300px] items-center outline-none max-lg:max-w-[200px] max-md:max-w-[200px] max-sm:max-w-[120px]"
    >
      <Image
        className="aspect-auto w-auto object-contain"
        width={300}
        height={83}
        alt={''}
        src={'/images/logo-300x80.svg'}
        priority={true}
      />
    </Link>
  );
};

export default Logo;
