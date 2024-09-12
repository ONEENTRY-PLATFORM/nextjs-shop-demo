import Link from 'next/link';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

const MenuItem: React.FC<{
  page: IMenusPages;
}> = ({ page }) => {
  if (!page) {
    return;
  }

  return (
    <li className="relative box-border">
      <Link className="hover:text-red-500" href={'/' + page.pageUrl}>
        {page.localizeInfos.menuTitle}
      </Link>
    </li>
  );
};

export default MenuItem;
