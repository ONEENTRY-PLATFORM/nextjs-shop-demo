'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Review animations.
 * @param   {object}      props           - Props for ReviewAnimations.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {number}      props.index     - Index of element for animations stagger.
 * @param   {boolean}     props.state     - current state of review.
 * @returns {JSX.Element}                 Review animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ReviewAnimations = ({
  children,
  className,
  index,
  state,
}: {
  children: ReactNode;
  className: string;
  index: number;
  state: boolean;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // component toggle animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });
    tl.fromTo(
      ref.current,
      {
        autoAlpha: 0,
        height: 0,
        yPercent: -100,
      },
      {
        autoAlpha: 1,
        height: 'auto',
        yPercent: 0,
        duration: 0.35,
        delay: index / 10,
      },
    );

    if (!state) {
      tl.reverse(0.75);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [state]);

  // leaving stage animations
  useGSAP(() => {
    const tl = gsap.timeline();

    if (stage === 'leaving' && prevStage === 'none' && state) {
      tl.to(ref.current, {
        height: 0,
        autoAlpha: 0,
        yPercent: -100,
        duration: 0.5,
        delay: index / 10,
      });
      tl.play();
    }

    setPrevStage(stage);

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default ReviewAnimations;
