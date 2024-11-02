'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

const IntroAnimations = () => {
  const ref = useRef(null);

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
      })
      .to(ref.current, {
        autoAlpha: 0,
        duration: 0.5,
        display: 'none',
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
