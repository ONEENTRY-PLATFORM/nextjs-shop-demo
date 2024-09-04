'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';

interface MenuItemProps {
  label: string;
  href: string;
  hasDropdown: boolean;
  categories: any;
}

export default function MobileMenu({ menu }: { menu: MenuItemProps[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open menu"
        className="flex size-10 flex-col items-center justify-center gap-1 rounded-md transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
            <DialogPanel className="fixed max-w-[420px] inset-0 flex size-full flex-col bg-white pb-6 dark:bg-black">
              <div className="p-4">
                <button
                  aria-label="Close menu"
                  onClick={closeMobileMenu}
                  className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-full bg-[#EEEFF0]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.912089 0.925739C1.11192 0.725769 1.38291 0.613433 1.66546 0.613433C1.94802 0.613433 2.21901 0.725769 2.41884 0.925739L6.99344 5.50494L11.568 0.925739C11.6663 0.823861 11.7839 0.7426 11.9139 0.686697C12.0439 0.630794 12.1838 0.601369 12.3252 0.600138C12.4667 0.598907 12.607 0.625895 12.738 0.679528C12.869 0.733161 12.9879 0.812365 13.088 0.912517C13.188 1.01267 13.2672 1.13176 13.3207 1.26285C13.3743 1.39394 13.4013 1.5344 13.4001 1.67603C13.3988 1.81766 13.3694 1.95763 13.3136 2.08777C13.2577 2.21791 13.1766 2.33561 13.0748 2.434L8.50019 7.01321L13.0748 11.5924C13.2689 11.7936 13.3763 12.063 13.3739 12.3427C13.3714 12.6224 13.2594 12.8899 13.0618 13.0877C12.8642 13.2854 12.597 13.3976 12.3176 13.4001C12.0382 13.4025 11.769 13.295 11.568 13.1007L6.99344 8.52147L2.41884 13.1007C2.21787 13.295 1.94869 13.4025 1.6693 13.4001C1.3899 13.3976 1.12264 13.2854 0.92507 13.0877C0.7275 12.8899 0.615432 12.6224 0.613004 12.3427C0.610576 12.063 0.717983 11.7936 0.912089 11.5924L5.48669 7.01321L0.912089 2.434C0.712321 2.23398 0.600098 1.96271 0.600098 1.67987C0.600098 1.39703 0.712321 1.12577 0.912089 0.925739Z"
                      fill="#4C4D56"
                    ></path>
                    <path
                      d="M0.912089 0.925739C1.11192 0.725769 1.38291 0.613433 1.66546 0.613433C1.94802 0.613433 2.21901 0.725769 2.41884 0.925739L6.99344 5.50494L11.568 0.925739C11.6663 0.823861 11.7839 0.7426 11.9139 0.686697C12.0439 0.630794 12.1838 0.601369 12.3252 0.600138C12.4667 0.598907 12.607 0.625895 12.738 0.679528C12.869 0.733161 12.9879 0.812365 13.088 0.912517C13.188 1.01267 13.2672 1.13176 13.3207 1.26285C13.3743 1.39394 13.4013 1.5344 13.4001 1.67603C13.3988 1.81766 13.3694 1.95763 13.3136 2.08777C13.2577 2.21791 13.1766 2.33561 13.0748 2.434L8.50019 7.01321L13.0748 11.5924C13.2689 11.7936 13.3763 12.063 13.3739 12.3427C13.3714 12.6224 13.2594 12.8899 13.0618 13.0877C12.8642 13.2854 12.597 13.3976 12.3176 13.4001C12.0382 13.4025 11.769 13.295 11.568 13.1007L6.99344 8.52147L2.41884 13.1007C2.21787 13.295 1.94869 13.4025 1.6693 13.4001C1.3899 13.3976 1.12264 13.2854 0.92507 13.0877C0.7275 12.8899 0.615432 12.6224 0.613004 12.3427C0.610576 12.063 0.717983 11.7936 0.912089 11.5924L5.48669 7.01321L0.912089 2.434C0.712321 2.23398 0.600098 1.96271 0.600098 1.67987C0.600098 1.39703 0.712321 1.12577 0.912089 0.925739Z"
                      stroke="#4C4D56"
                    ></path>
                  </svg>
                </button>
                <div className="mb-4 w-full">
                  {/* <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense> */}
                </div>
                {menu.length ? (
                  <ul className="flex w-full flex-col">
                    {menu.map((item: MenuItemProps) => (
                      <li
                        className="py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                        key={item.label}
                      >
                        <Link
                          href={item.href}
                          prefetch={true}
                          onClick={closeMobileMenu}
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
    </>
  );
}
