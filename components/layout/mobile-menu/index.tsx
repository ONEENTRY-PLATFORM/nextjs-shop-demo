'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { useContext, useEffect } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import ModalBackdrop from '../modal/components/ModalBackdrop';
import MobileMenuAnimations from './animations/MobileMenuAnimations';
import CloseModal from './components/CloseModal';
import MobileMenu from './components/MobileMenu';

/**
 * Mobile menu offscreen modal component.
 * Renders the mobile menu in an offscreen modal with animations and backdrop.
 * @param   {object}                         props      - Component properties
 * @param   {IMenusPages[]}                  props.menu - Array of menu items to display in the mobile menu
 * @param   {string}                         props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @returns {JSX.Element | null | undefined}            The rendered mobile menu component or nothing if conditions aren't met
 */
const OffscreenModal = ({
  menu,
  lang,
}: {
  menu: IMenusPages[];
  lang: string;
}): JSX.Element | null | undefined => {
  /** Get the current pathname to detect route changes */
  const pathname = usePathname();
  /** Access the mobile menu state from the OpenDrawerContext */
  const { open, setOpen, component } = useContext(OpenDrawerContext);

  /** Effect to handle window resize events */
  useEffect(() => {
    /** Function to close the menu when window is resized to desktop size */
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    /** Add event listener for resize events */
    window.addEventListener('resize', handleResize);

    /* Cleanup function to remove event listener */
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** Effect to close the menu when the pathname changes (navigation occurs) */
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /** Don't render if the menu is not open or if this is not the MobileMenu component */
  if (!open || component !== 'MobileMenu') {
    return;
  }

  /** Render the mobile menu modal with animations */
  return (
    <MobileMenuAnimations
      id="modalBody"
      className="fixed left-1/2 top-1/2 z-50 flex size-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto bg-white p-6 pt-12 shadow-xl md:overflow-hidden md:rounded-3xl lg:h-auto lg:w-[550px] lg:p-10"
    >
      {/* Main container for the mobile menu modal */}
      <div className="fixed inset-0 z-50 flex size-full max-w-[420px] flex-col bg-white pb-6">
        <div className="p-6">
          {/* Close button for the mobile menu modal */}
          <CloseModal />

          {/* Logo display in the mobile menu */}
          <div className="mb-4 w-full">
            <Image
              src={'/images/logo-250x70.svg'}
              width={180}
              height={50}
              alt={'OneEntry'}
              loading="lazy"
              className="aspect-[3.57] max-w-full shrink-0 max-sm:mb-5"
            />
          </div>

          {/* The actual mobile menu items */}
          <MobileMenu menu={menu} lang={lang} />
        </div>
      </div>

      {/* Backdrop overlay for the mobile menu modal */}
      <ModalBackdrop />
    </MobileMenuAnimations>
  );
};

export default OffscreenModal;
