'use client';

import Link from 'next/link';

import FavoritesIcon from '@/components/icons/favorites';

const NavItemFavorites: React.FC = () => {
  const item = {
    href: '/favorites',
    title: 'Favorites',
  };

  return (
    <Link
      href={item.href}
      title={item.title}
      className="relative box-border flex size-6 shrink-0 flex-col"
    >
      <FavoritesIcon />
    </Link>
  );
};

export default NavItemFavorites;
