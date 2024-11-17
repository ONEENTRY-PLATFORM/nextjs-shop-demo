'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC } from 'react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

/**
 * ProductsGrid loader animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 *
 * @returns loader with animations
 */
const ProductsGridLoaderAnimations: FC<{
  children: ReactNode;
  className: string;
}> = ({ children, className }) => {
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
