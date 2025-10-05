'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';
import { useRef } from 'react';

/**
 * Intro animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns {JSX.Element} JSX.Element with animated ref
 */
const IntroAnimations = (): JSX.Element => {
  const ref = useRef(null);

  // Intro animations
  useGSAP(() => {
    const tl = gsap
      .timeline()
      .set('.fade-in', {
        autoAlpha: 0,
      })
      .to(ref.current, {
        delay: 0.25,
        autoAlpha: 0,
        duration: 0.35,
        display: 'none',
      })
      .to('.fade-in', {
        delay: -0.15,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.1,
      });

    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className="fixed left-0 top-0 z-50 size-full bg-white"></div>
  );
};

export default IntroAnimations;
