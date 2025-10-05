import type { JSX } from 'react';

import { getMenuByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import { flatMenuToNested } from '@/components/utils/utils';

import OffscreenModal from '../mobile-menu';
import MainMenuLoader from './components/MenuLoader';
import NavigationMenu from './components/NavigationMenu';

/**
 * Main menu.
 * @returns {Promise<JSX.Element>} JSX.Element.
 */
const MainMenu = async (): Promise<JSX.Element> => {
  // Get props from server provider
  const [lang] = ServerProvider('lang');

  // Get menu by marker from api
  const { isError, menu } = await getMenuByMarker('main_web', lang as string);

  if (isError) {
    return <></>;
  }

  if (!menu || !menu.pages) {
    return <MainMenuLoader limit={4} />;
  }

  // convert menu flat array to nested
  const mainMenu = flatMenuToNested(
    Array.isArray(menu.pages) ? menu.pages : [],
    null,
  );

  return (
    <>
      <NavigationMenu menu={mainMenu} lang={lang as string} />
      <OffscreenModal menu={mainMenu} lang={lang as string} />
    </>
  );
};

export default MainMenu;
