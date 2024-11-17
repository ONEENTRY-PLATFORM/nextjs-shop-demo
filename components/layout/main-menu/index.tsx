import type { FC } from 'react';

import { getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { flatMenuToNested } from '@/components/utils';

import OffscreenModal from '../mobile-menu';
import MainMenuLoader from './components/MenuLoader';
import NavigationMenu from './components/NavigationMenu';

/**
 * Main menu
 * @async server component
 * @returns JSX.Element
 */
const MainMenu: FC = async () => {
  // Get props from server provider
  const [lang] = useServerProvider('lang');

  // Get menu by marker from api
  const { isError, menu } = await getMenuByMarker('main_web', lang);

  if (isError) {
    return;
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
      <NavigationMenu menu={mainMenu} lang={lang} />
      <OffscreenModal menu={mainMenu} lang={lang} />
    </>
  );
};

export default MainMenu;
