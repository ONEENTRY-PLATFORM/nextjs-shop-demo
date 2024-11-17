/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * MainMenu Loader
 * @param limit
 *
 * @returns MainMenu Loader
 */
const MainMenuLoader: FC<LoaderProps> = ({ limit = 4 }) => {
  return (
    <div className="relative z-20 items-center justify-center bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-lg:text-sm max-md:hidden max-md:px-5 max-md:text-sm md:flex">
      <div className="flex w-full max-w-screen-xl items-center justify-center py-5 max-md:px-5">
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {Array.from(Array(limit).keys()).map((item) => (
            <li
              key={item}
              className="group my-auto flex w-1/4 justify-between gap-5 whitespace-nowrap py-1"
            >
              <div className="animate-loader relative box-border flex w-full shrink-0 flex-row items-center gap-2.5 text-slate-800 hover:text-red-500">
                <div className="h-5" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainMenuLoader;
