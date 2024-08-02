import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      prefetch={true}
      className="relative h-[80px] w-full max-w-[300px]"
    >
      <Image
        className="object-contain"
        fill
        alt={''}
        src={'/images/logo-300x80.svg'}
        priority={true}
      />
    </Link>
  );
};

export default Logo;
