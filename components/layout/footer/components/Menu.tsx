import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import MenuItem from './MenuItem';

/**
 * Footer menu component for rendering navigation menus in the footer.
 * Displays a list of menu items with localized titles.
 * @param   {object}       props      - Menu props.
 * @param   {IMenusEntity} props.menu - Represents a menu object.
 * @returns {JSX.Element}             footer menu.
 */
const Menu = ({ menu }: { menu: IMenusEntity }): JSX.Element => {
  /**
   * Get current language from server provider
   * Used to fetch localized menu content
   */
  const [lang] = ServerProvider('lang');

  /**
   * Extract pages from the menu object
   * These are the individual menu items to be displayed
   */
  const pages = menu.pages as Array<IMenusPages>;

  /**
   * Return empty fragment if no pages are available
   * Prevents rendering empty menus
   */
  if (!pages || (Array.isArray(pages) && pages.length < 1)) {
    return <></>;
  }

  /**
   * Get localized menu title or fallback to default title
   * Displays the appropriate title based on the current language
   */
  const title = menu.localizeInfos.title;

  return (
    /**
     * Container for the footer menu
     * Uses flex layout with responsive width adjustments
     */
    <div className="max-xs:w-[45%] flex flex-col">
      {/** Navigation element containing the menu title and items */}
      <nav className="flex flex-col text-white">
        {/** Menu title from CMS with styling */}
        <h2 className="mb-5 text-xl font-bold">{title}</h2>
        {/** List of menu items. Maps through pages and renders MenuItem components */}
        <ul className="flex flex-col gap-1.5 text-base font-semibold">
          {pages.map((page) => {
            return <MenuItem key={page.id} page={page} lang={lang as string} />;
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
