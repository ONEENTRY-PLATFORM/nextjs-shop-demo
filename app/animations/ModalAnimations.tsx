'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '../store/providers/OpenDrawerContext';

const ModalAnimations = ({ children }: { children: ReactNode }) => {
  const { open, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!open) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setTransition('');
      },
      onReverseComplete: () => {
        setOpen(false);
        setTransition('');
      },
    });
    gsap.set('#modalBg, #modalBody', {
      scale: 0,
      autoAlpha: 0,
    });

    tl.to('#modalBg, #modalBody', {
      scale: 1,
      autoAlpha: 1,
    });

    if (transition === 'close') {
      tl.reverse(0.5);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [open, transition]);

  if (!open) {
    return;
  }

  return (
    <div ref={ref} className="fixed z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default ModalAnimations;
