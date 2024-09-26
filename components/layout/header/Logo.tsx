import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Logo: FC<{ params: any }> = async ({ params }) => {
  console.log(params.lang);
  return (
    <Link
      href={'/' + params.lang}
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
