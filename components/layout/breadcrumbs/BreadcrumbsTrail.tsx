'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BreadcrumbItem from './BreadcrumbItem';

const BreadcrumbsTrail: React.FC = () => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  return (
    <nav className="relative box-border flex">
      <ul className="flex w-full items-center gap-1.5 text-slate-300">
        <li>
          <Link href={'/'} className=" hover:text-orange-500">
            Home
          </Link>
        </li>
        {pathNames?.map((link, index) => (
          <li key={index}>
            <BreadcrumbItem
              link={link}
              isLast={index === pathNames.length - 1}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BreadcrumbsTrail;
