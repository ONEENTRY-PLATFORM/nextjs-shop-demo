'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const IntroAnimations = () => {
  useGSAP(() => {
    const tl = gsap
      .timeline()
      .set('.fade-in', {
        autoAlpha: 0,
      })
      .to('.fade-in', {
        autoAlpha: 1,
        duration: 0.5,
        delay: 0.25,
        stagger: 0.1,
      });

    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  return null;
};

export default IntroAnimations;
