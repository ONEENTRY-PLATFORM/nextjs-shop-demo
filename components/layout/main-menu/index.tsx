import type { JSX } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import { flatMenuToNested } from '@/components/utils/utils';

import OffscreenModal from '../mobile-menu';
import MainMenuLoader from './components/MenuLoader';
import NavigationMenu from './components/NavigationMenu';

/**
 * Main menu component that fetches and renders the navigation menu.
 * This component handles data fetching, error states, and loading states for the main navigation.
 * @returns {Promise<JSX.Element>} The main navigation menu with mobile modal or loading state
 */
const MainMenu = async (): Promise<JSX.Element> => {
  /** Get the current language from the server provider */
  const [lang] = ServerProvider('lang');

  /** Fetch the menu data by marker from the API */
  const { isError, menu } = await getMenuByMarker('main_web', lang as string);

  /** Return empty element if there's an error fetching the menu */
  if (isError) {
    return <></>;
  }

  /** Show loading state if menu data is not available */
  if (!menu || !menu.pages) {
    return <MainMenuLoader limit={4} />;
  }

  /** Convert the flat menu array to a nested structure for proper rendering */
  const mainMenu = flatMenuToNested(
    Array.isArray(menu.pages) ? menu.pages : [],
    null,
  );

  /** Render the navigation menu and offscreen mobile menu modal */
  return (
    <>
      <NavigationMenu menu={mainMenu} lang={lang as string} />
      <OffscreenModal menu={mainMenu} lang={lang as string} />
    </>
  );
};

export default MainMenu;
