'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import { useContext, useEffect } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import ModalBackdrop from '../modal/components/ModalBackdrop';
import MobileMenuAnimations from './animations/MobileMenuAnimations';
import CloseModal from './components/CloseModal';
import MobileMenu from './components/MobileMenu';

function OffscreenModal({ menu, lang }: { menu: IMenusPages[]; lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open, setOpen, component } = useContext(OpenDrawerContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    // setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!open || component !== 'MobileMenu') {
    return;
  }

  return (
    <MobileMenuAnimations
      id="modalBody"
      className="fixed left-1/2 top-1/2 z-50 flex size-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto bg-white p-6 pt-12 shadow-xl md:overflow-hidden md:rounded-3xl lg:h-auto lg:w-[550px] lg:p-10"
    >
      <div className="fixed inset-0 z-50 flex size-full max-w-[420px] flex-col bg-white pb-6">
        <div className="p-6">
          <CloseModal />

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

          <MobileMenu menu={menu} lang={lang} />
        </div>
      </div>
      <ModalBackdrop />
    </MobileMenuAnimations>
  );
}

export default OffscreenModal;
