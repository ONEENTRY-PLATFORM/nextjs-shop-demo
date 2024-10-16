'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormAnimations = ({ children }: { children: any }) => {
  const { stage } = useTransitionState();

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.form-input', {
      autoAlpha: 0,
      scale: 0,
      xPercent: -100,
    }).to('.form-input', {
      autoAlpha: 1,
      scale: 1,
      xPercent: 0,
      stagger: 0.05,
    });

    if (stage === 'leaving') {
      tl.reverse(1);
    } else if (stage === 'entering') {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [stage]);

  return children;
};

export default FormAnimations;
