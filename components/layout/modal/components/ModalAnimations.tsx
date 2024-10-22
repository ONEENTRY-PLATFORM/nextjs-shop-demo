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
        if (transition === 'close') {
          setOpen(false);
        }
        setTransition('');
      },
    });

    if (transition === 'close') {
      tl.to(
        '#modalBg, #modalBody',
        {
          autoAlpha: 0,
          scaleX: 0,
          ease: 'Power2.easeOut',
          transformOrigin: '50% 50%',
          duration: 0.25,
          delay: 0.25,
        }
      )
      .play();
    } else {
      gsap.set('#modalBg, #modalBody', {
        scaleX: 0,
        autoAlpha: 0,
      });
      tl.to('#modalBg, #modalBody', {
        scaleX: 1,
        autoAlpha: 1,
        height: 'auto',
      }).to('#modalBg', {
        backdropFilter: 'blur(10px)',
        autoAlpha: 1,
        delay: -0.35
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
