'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const CategoriesAnimations = ({
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

    if (stage === 'leaving') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scale: 0,
        stagger: 0.1,
      });
      tl.play();
    }
    if (stage === 'entering') {
      tl.set(ref.current, {
        autoAlpha: 0,
        scale: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        scale: 1,
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

export default CategoriesAnimations;
