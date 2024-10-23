'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const PaymentMethodsAnimations: FC<{
  children: ReactNode;
  className: string;
}> = ({ children, className }) => {
  const { open, transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    gsap.set(ref.current, {
      transformOrigin: '0 0',
      overflow: 'hidden',
    });

    const tl = gsap.timeline({
      paused: true,
    });

    tl.fromTo(
      ref.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      },
    );
    tl.play();

    if (transition === 'close') {
      tl.reverse(0.5);
    }

    return () => {
      tl.kill();
    };
  }, [transition, open]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default PaymentMethodsAnimations;
