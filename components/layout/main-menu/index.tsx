import type { FC } from 'react';

import { getMenuByMarker } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import { flatMenuToNested } from '@/components/utils';

import OffscreenModal from '../mobile-menu';
import MainMenu from './components/MainMenu';
import MainMenuLoader from './components/MenuLoader';

const NavigationMenu: FC = async () => {
  const [lang] = useServerProvider('lang');
  const { isError, menu } = await getMenuByMarker('main_web', lang);

  if (isError || !menu || !menu.pages) {
    return <MainMenuLoader limit={4} />;
  }

  const mainMenu = flatMenuToNested(
    Array.isArray(menu.pages) ? menu.pages : [],
    null,
  );

  return (
    <>
      <MainMenu menu={mainMenu} lang={lang} />
      <OffscreenModal menu={mainMenu} lang={lang} />
    </>
  );
};

export default NavigationMenu;
