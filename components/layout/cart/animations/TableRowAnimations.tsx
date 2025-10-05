'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';
import { useRef } from 'react';

import type { AnimationsProps } from '@/app/types/global';

/**
 * Table row animations.
 * @param   {AnimationsProps} props           - props.
 * @param   {ReactNode}       props.children  - children ReactNode.
 * @param   {string}          props.className - CSS className of ref element.
 * @param   {number}          props.index     - index of element in array for stagger.
 * @returns {JSX.Element}                     Table row animations component.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const TableRowAnimations = ({
  children,
  className,
  index,
}: AnimationsProps): JSX.Element => {
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
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default TableRowAnimations;
