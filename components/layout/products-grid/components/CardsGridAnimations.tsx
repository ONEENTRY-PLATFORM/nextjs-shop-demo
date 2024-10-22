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

    if (stage === 'entering') {
      tl.set('.product-card', {
        scale: 0,
      }).to('.product-card', {
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
      });
      tl.play();
    }
    if (stage === 'leaving') {
      tl.to('.product-card', {
        scale: 0,
        duration: 0.5,
        stagger: 0.1,
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
