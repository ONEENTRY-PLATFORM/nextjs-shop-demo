'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Order animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param isActive
 *
 * @returns JSX.Element
 */
const OrderAnimations: FC<{
  children: ReactNode;
  className: string;
  isActive: boolean;
}> = ({ children, className, isActive }) => {
  const ref = useRef(null);

  // open order animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });
    if (isActive) {
      tl.set(ref.current, {
        transformOrigin: '0 0',
        autoAlpha: 0,
        height: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        height: 'auto',
      });
      tl.play();
    } else {
      tl.to(ref.current, {
        autoAlpha: 0,
        height: 0,
      }).play();
    }

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default OrderAnimations;
