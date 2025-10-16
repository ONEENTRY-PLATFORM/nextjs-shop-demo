/* eslint-disable jsdoc/no-undefined-types */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';
import { useRef } from 'react';

import type { AnimationsProps } from '../types/global';

/**
 * Fade transition animations
 * @param   {object}      props           - Animation properties
 * @param   {ReactNode}   props.children  - children ReactNode
 * @param   {string}      props.className - CSS className of ref element
 * @param   {number}      props.index     - Index of element for animations stagger
 * @returns {JSX.Element}                 JSX.Element with animated ref
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FadeTransition = ({
  children,
  className,
  index,
}: AnimationsProps): JSX.Element => {
  const ref = useRef(null);
  /** on stage enter animations */
  useGSAP(() => {
    /** Create a new timeline for fade in animation */
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
    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /** Render the animated component with initial opacity set to 0 */
  return (
    <div ref={ref} className={className + ' opacity-0'}>
      {children}
    </div>
  );
};

export default FadeTransition;
