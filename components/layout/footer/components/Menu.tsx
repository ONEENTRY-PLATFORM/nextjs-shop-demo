import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';

import MenuItem from './MenuItem';

/**
 * Footer menu
 * @param menu Represents a menu object.
 *
 * @returns footer menu
 */
const Menu: FC<{
  menu: IMenusEntity;
}> = ({ menu }) => {
  const [lang] = useServerProvider('lang');
  const pages = menu.pages as Array<IMenusPages>;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  if (!pages || (Array.isArray(pages) && pages.length < 1)) {
    return;
  }
  const title = menu.localizeInfos[langCode]?.title || menu.localizeInfos.title;

  return (
    <div className="flex flex-col max-lg:w-[21%] max-md:w-1/2 max-sm:w-[45%] max-xs:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">{title}</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {pages.map((page, index) => {
            return <MenuItem key={index} page={page} lang={lang} />;
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
