'use client';

import type { FC, ReactNode } from 'react';

import CardAnimationsClient from './CardAnimationsClient';

/**
 * Card animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 * @param pagesLimit used for animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns Card animations
 */
const CardAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
  pagesLimit: number;
  currentPage?: number;
}> = ({ children, className, index, pagesLimit, currentPage = 1 }) => {
  return (
    <CardAnimationsClient
      className={className}
      index={index}
      pagesLimit={pagesLimit}
      currentPage={currentPage}
    >
      {children}
    </CardAnimationsClient>
  );
};

export default CardAnimations;
