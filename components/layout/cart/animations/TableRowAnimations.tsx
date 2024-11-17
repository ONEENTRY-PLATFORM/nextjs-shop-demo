'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC } from 'react';
import { useRef } from 'react';

import type { AnimationsProps } from '@/app/types/global';

/**
 * Table row animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index index of element in array for stagger
 *
 * @returns
 */
const TableRowAnimations: FC<AnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const ref = useRef(null);

  // first load animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      opacity: 0,
      yPercent: 200,
    }).to(ref.current, {
      opacity: 1,
      yPercent: 0,
      delay: index / 10,
    });
    tl.play();

    return () => {
      tl.kill();
    };
  }, [ref]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default TableRowAnimations;
