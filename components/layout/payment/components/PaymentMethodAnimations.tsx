'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const PaymentMethodAnimations = ({
  children,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  isActive,
}: {
  children: ReactNode;
  className: string;
  index: number;
  isActive: boolean;
}) => {
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
        height: 110,
      },
      {
        height: 'auto',
      },
    );

    if (isActive) {
      tl.play();
    } else {
      tl.reverse(0.5);
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
