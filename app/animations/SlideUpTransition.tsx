'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

const SlideUpTransition = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.from(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.5,
      delay: index / 20,
      ease: 'power2.inOut',
    });

    if (stage === 'none' && prevStage === 'entering') {
      tl.play();
    } else if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1);
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

export default SlideUpTransition;
