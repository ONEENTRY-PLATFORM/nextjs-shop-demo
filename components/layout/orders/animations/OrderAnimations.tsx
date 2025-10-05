'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Order animations.
 * @param   {object}      props           - Order animations props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {boolean}     props.isActive  - current state of order block.
 * @returns {JSX.Element}                 JSX.Element.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const OrderAnimations = ({
  children,
  className,
  isActive,
}: {
  children: ReactNode;
  className: string;
  isActive: boolean;
}): JSX.Element => {
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default OrderAnimations;
