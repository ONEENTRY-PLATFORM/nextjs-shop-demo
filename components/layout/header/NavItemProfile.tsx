import Image from 'next/image';
import Link from 'next/link';

const NavItemProfile: React.FC = () => {
  const item = {
    icon: '/icons/user.svg',
    href: '/profile',
    title: 'user',
  };

  return (
    <Link
      href={item.href}
      title={item.title}
      className="relative box-border flex size-6 shrink-0 flex-col"
    >
      <Image
        className="object-contain"
        width={24}
        height={24}
        alt={item.title}
        src={item.icon}
        priority
      />
    </Link>
  );
};

export default NavItemProfile;
