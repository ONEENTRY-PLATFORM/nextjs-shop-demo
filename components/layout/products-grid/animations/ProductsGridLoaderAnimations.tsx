'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX } from 'react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

/**
 * ProductsGrid loader animations.
 * @param   {object}      props           - ProductsGrid loader props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @returns {JSX.Element}                 loader with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProductsGridLoaderAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
      yoyo: true,
      repeat: -1,
    });
    const cards =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.product-card');

    tl.from(cards, {
      autoAlpha: 0,
    }).to(cards, {
      autoAlpha: 1,
      duration: 1,
      delay: 0.5,
      stagger: 0.1,
    });

    tl.play();

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ProductsGridLoaderAnimations;
