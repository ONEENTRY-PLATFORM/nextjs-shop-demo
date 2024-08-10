import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BreadcrumbItem from './BreadcrumbItem';

interface BreadcrumbsTrailProps {
  items: Array<{
    href: string;
    text: string;
  }>;
}

const BreadcrumbsTrail: React.FC<BreadcrumbsTrailProps> = ({ items }) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  return (
    <nav className="relative box-border flex shrink-0 flex-row gap-1.5">
      <ul className="relative box-border flex shrink-0 flex-row gap-1.5">
        <li>
          <Link href={'/'}>Home</Link>
        </li>
        {pathNames?.map((link, index) => (
          <li key={index}>
            <BreadcrumbItem link={link} isLast={index === items.length - 1} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BreadcrumbsTrail;
