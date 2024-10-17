'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '../store/providers/OpenDrawerContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilterModalAnimations = ({ children }: { children: any }) => {
  const { open, component, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!open || component !== 'FilterForm') {
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
      autoAlpha: 0,
      xPercent: 100,
    });

    tl.to('#modalBg, #modalBody', {
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

  if (!open || component !== 'FilterForm') {
    return;
  }

  return (
    <div ref={ref} className="fixed z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default FilterModalAnimations;
