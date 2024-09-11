import Link from 'next/link';
import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';

const Menu: React.FC<{
  menu: IMenusEntity;
}> = ({ menu }) => {
  const pages = menu.pages as Array<IMenusPages>;

  return (
    <div className="flex w-[21%] flex-col max-md:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">{menu.localizeInfos.title}</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {pages.map((page, index) => (
            <li key={index} className="relative box-border">
              <Link className="hover:text-red-500" href={page.pageUrl}>
                {page.localizeInfos.menuTitle}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
