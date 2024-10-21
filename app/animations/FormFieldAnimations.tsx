'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const FormFieldAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}) => {
  const { open, transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!open || !ref.current) {
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
        width: 0,
        opacity: 0,
      },
      {
        width: '100%',
        opacity: 1,
        delay: index / 10,
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

export default FormFieldAnimations;
