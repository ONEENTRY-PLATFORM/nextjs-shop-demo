'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '../store/providers/OpenDrawerContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilterModalAnimations = ({ children }: { children: any }) => {
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

    tl.set('#modalBg, #modalBody', {
      autoAlpha: 0,
      xPercent: 100,
    }).to('#modalBg, #modalBody', {
      autoAlpha: 1,
      xPercent: 0,
    });

    if (transition === 'close') {
      tl.reverse(4);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [open, transition]);

  return (
    <div ref={ref} className="fixed z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default FilterModalAnimations;
