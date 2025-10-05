'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Order row animations.
 * @param   {object}      props           - Props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {number}      props.index     - Index of element for animations stagger.
 * @returns {JSX.Element}                 JSX.Element
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const OrderRowAnimations = ({
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

  // intro animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
    })
      .to(ref.current, {
        autoAlpha: 1,
        delay: index / 10,
      })
      .play();

    return () => {
      tl.kill();
    };
  }, []);

  // leaving stage animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        delay: index / 10,
      }).play();
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

export default OrderRowAnimations;
