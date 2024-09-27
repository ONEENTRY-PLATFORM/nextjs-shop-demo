'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import { Fragment, useContext, useEffect } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import CloseModal from './CloseModal';
import MobileMenu from './MobileMenu';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OffscreenModal({ menu, lang }: { menu: IMenusPages[]; lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open, setOpen, component } = useContext(OpenDrawerContext);
  const closeMenu = () => setOpen(false);

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
    if (component === 'MobileMenu') {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const logo = {
    src: '/images/logo-250x70.svg',
    width: 180,
    height: 50,
    alt: 'OneEntry',
  };

  return (
    <Transition show={open && component === 'MobileMenu'}>
      <Dialog onClose={closeMenu} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[5px]"
            aria-hidden="true"
          />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-[-100%]"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[-100%]"
        >
          <DialogPanel className="fixed inset-0 flex size-full max-w-[420px] flex-col bg-white pb-6">
            <div className="p-6">
              <CloseModal closeMenu={closeMenu} />

              <div className="mb-4 w-full">
                <Image
                  src={logo.src}
                  width={logo.width}
                  height={logo.height}
                  alt={logo.alt}
                  loading="lazy"
                  className="aspect-[3.57] max-w-full shrink-0 max-sm:mb-5"
                />
              </div>

              <MobileMenu menu={menu} lang={lang} />
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default OffscreenModal;
