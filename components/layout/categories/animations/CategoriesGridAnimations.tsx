'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Categories grid stage leaving animations.
 * @param   {object}      props           - categories grid props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - categories grid wrapper className.
 * @returns {JSX.Element}                 categories grid wrapper with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CategoriesGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState<string>('');
  const ref = useRef(null);

  // stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
      });
      tl.play();
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

export default CategoriesGridAnimations;
