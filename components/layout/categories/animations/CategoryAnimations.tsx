'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

interface CategoryAnimationsProps {
  children: ReactNode;
  className: string;
  index: number;
}

/**
 * Category card stage entering/leaving animations
 * @param children children ReactNode
 * @param className category card wrapper className
 * @param index index of element in array for stagger
 *
 * @returns category card wrapper with animations
 */
const CategoryAnimations: FC<CategoryAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  // stage entering/leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scale: 0,
        delay: index / 10,
      });
      tl.play();
    }
    if (stage === 'entering') {
      tl.set(ref.current, {
        autoAlpha: 0,
        scale: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        scale: 1,
        delay: index / 10,
      });
      tl.play();
    }

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

export default CategoryAnimations;
