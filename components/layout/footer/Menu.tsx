import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import MenuItem from './MenuItem';

const Menu: FC<{
  menu: IMenusEntity;
}> = ({ menu }) => {
  const pages = menu.pages as Array<IMenusPages>;

  if (pages.length < 1) {
    return;
  }

  return (
    <div className="flex flex-col max-lg:w-[21%] max-md:w-[50%] max-sm:w-[45%] max-xs:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">{menu.localizeInfos.title}</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {pages.map((page, index) => (
            <MenuItem key={index} page={page} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
