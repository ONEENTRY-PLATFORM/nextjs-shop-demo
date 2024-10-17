'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';

const FormAnimations = ({
  children,
  isLoading,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  isLoading: boolean;
}) => {
  const { stage } = useTransitionState();

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.input-group', {
      autoAlpha: 0,
      scale: 0,
      yPercent: -100,
    }).to('.input-group', {
      autoAlpha: 1,
      scale: 1,
      yPercent: 0,
      stagger: 0.05,
    });

    if (stage === 'leaving') {
      tl.reverse(1);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [stage, isLoading]);

  return children;
};

export default FormAnimations;
