'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface FilterAnimationsProps {
  children: ReactNode;
  className: string;
  index: number;
}

/**
 * Filter wrapper animations
 * @param children children ReactNode
 * @param className Filter wrapper className
 * @param index index of element in array for stagger
 *
 * @returns filter wrapper with animations
 */
const FilterAnimations: FC<FilterAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
      height: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      height: 'auto',
      delay: index / 10,
    });
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    if (transition === 'close') {
      tl.to(ref.current, {
        autoAlpha: 0,
        yPercent: 100,
        height: 0,
        duration: 0.5,
        delay: -index / 20,
      });
    }

    return () => {
      tl.kill();
    };
  }, [transition]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default FilterAnimations;
