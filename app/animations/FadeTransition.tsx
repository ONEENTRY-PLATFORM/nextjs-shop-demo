/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC } from 'react';
import { useRef } from 'react';

import type { AnimationsProps } from '../types/global';

/**
 * Fade transition animations
 *
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 *
 * @returns JSX.Element with animated ref
 */
const FadeTransition: FC<AnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const ref = useRef(null);

  // on stage enter animations
  useGSAP(() => {
    const tl = gsap
      .timeline()
      .set(ref.current, {
        autoAlpha: 0,
      })
      .to(ref.current, {
        autoAlpha: 1,
        duration: 0.8,
        delay: index / 10,
      });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className + ' opacity-0'}>
      {children}
    </div>
  );
};

export default FadeTransition;
