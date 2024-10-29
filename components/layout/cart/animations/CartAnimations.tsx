'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

const CartAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.product-in-cart, .tr, #total', {
      autoAlpha: 0,
      yPercent: 100,
    })
      .to('.product-in-cart', {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.1,
        delay: 0.35,
      })
      .to('.tr, #total', {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.1,
      });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1.2);
    }
    if (stage === 'entering') {
      tl.play();
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

export default CartAnimations;
