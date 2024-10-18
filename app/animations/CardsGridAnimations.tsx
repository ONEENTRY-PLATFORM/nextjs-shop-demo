'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const CardsGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });
    const elements =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.product-card');

    if (stage === 'entering') {
      tl.set(elements, {
        autoAlpha: 0,
        scale: 0,
      }).to(elements, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
      });
      tl.play();
    }
    if (stage === 'leaving') {
      tl.to(elements, {
        autoAlpha: 0,
        scale: 0,
        duration: 0.3,
        stagger: 0.05,
      });
      tl.play();
    }

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

export default CardsGridAnimations;
