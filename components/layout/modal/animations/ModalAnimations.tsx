'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

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

    if (transition === 'close') {
      tl.to('#modalBg, #modalBody', {
        scaleX: 1,
        autoAlpha: 1,
        duration: 0.5,
      }).reverse(0.5);
    } else {
      tl.set('#modalBg, #modalBody', {
        scaleX: 0,
        autoAlpha: 0,
      })
        .to('#modalBg, #modalBody', {
          scaleX: 1,
          autoAlpha: 1,
        })
        .to('#modalBg', {
          backdropFilter: 'blur(10px)',
          delay: -0.35,
        });
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
