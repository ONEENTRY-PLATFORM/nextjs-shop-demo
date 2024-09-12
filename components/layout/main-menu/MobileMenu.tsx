'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useContext, useEffect } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface MenuItemProps {
  label: string;
  href: string;
}

function MobileMenu({ menu }: { menu: MenuItemProps[] }) {
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
              <button
                aria-label="Close menu"
                onClick={closeMenu}
                className="absolute right-4 top-6 flex aspect-square size-12 shrink-0 items-center justify-center rounded-full border border-[#EEEFF0] text-xl"
              >
                &#10005;
              </button>

              <div className="mb-4 w-full">
                {/* <Suspense fallback={<SearchSkeleton />}>
                  <Search />
                </Suspense> */}
                <Image
                  src={logo.src}
                  width={logo.width}
                  height={logo.height}
                  alt={logo.alt}
                  loading="lazy"
                  className="aspect-[3.57] max-w-full shrink-0 max-sm:mb-5"
                />
              </div>

              {menu.length ? (
                <ul className="flex w-full flex-col">
                  {menu.map((item: MenuItemProps) => (
                    <li
                      className="py-2 text-lg text-black transition-colors hover:text-orange-500"
                      key={item.label}
                    >
                      <Link
                        href={item.href}
                        prefetch={true}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default MobileMenu;
