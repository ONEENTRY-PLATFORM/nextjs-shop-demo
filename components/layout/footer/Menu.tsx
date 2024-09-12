import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';

import MenuItem from './MenuItem';

const Menu: React.FC<{
  menu: IMenusEntity;
}> = ({ menu }) => {
  const pages = menu.pages as Array<IMenusPages>;

  if (pages.length < 1) {
    return;
  }

  return (
    <div className="flex w-[21%] flex-col max-md:w-full">
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
