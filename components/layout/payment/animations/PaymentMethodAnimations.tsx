'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

const PaymentMethodAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
  isActive: boolean;
}> = ({ children, className, isActive }) => {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    gsap.set(ref.current, {
      transformOrigin: '0 0',
    });

    const tl = gsap.timeline({
      paused: true,
    });

    const cartData = (ref.current as HTMLDivElement).querySelector('#cartData');

    if (isActive) {
      tl.fromTo(
        ref.current,
        {
          height: 110,
        },
        {
          height: 'auto',
        },
      )
        .to(cartData, {
          autoAlpha: 1,
          delay: -0.5,
        })
        .play();
    } else {
      tl.to(ref.current, {
        height: 110,
      })
        .to(cartData, {
          autoAlpha: 0,
          delay: -0.5,
        })
        .play();
    }

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default PaymentMethodAnimations;
