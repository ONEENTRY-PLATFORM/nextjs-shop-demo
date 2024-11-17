'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

interface ReviewAnimations {
  children: ReactNode;
  className: string;
  index: number;
  state: boolean;
}

/**
 * Review animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 * @param state
 *
 * @returns data
 */
const ReviewAnimations: FC<ReviewAnimations> = ({
  children,
  className,
  index,
  state,
}) => {
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
