'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * SlideUp transition
 * @param   {object}      props           - SlideUp transition properties
 * @param   {ReactNode}   props.children  - children ReactNode
 * @param   {string}      props.className - CSS className of ref element
 * @param   {number}      props.index     - Index of element for animations stagger
 * @returns {JSX.Element}                 JSX.Element with animated ref
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const SlideUpTransition = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // on stage change transitions
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.from(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.5,
      delay: index / 10,
    });

    if (stage === 'none' && prevStage === '') {
      tl.play();
    }
    if (stage === 'none' && prevStage === 'entering') {
      tl.play();
    }
    if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1);
    }

    setPrevStage(stage);

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

export default SlideUpTransition;
