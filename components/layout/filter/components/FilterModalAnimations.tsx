'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const FilterModalAnimations = ({ children }: { children: ReactNode }) => {
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

    gsap.set('#modalBg', {
      autoAlpha: 0,
    });

    gsap.set('#modalBody', {
      xPercent: 100,
    });

    tl.to('#modalBg', {
      autoAlpha: 1,
      backdropFilter: 'blur(10px)',
      xPercent: 0,
      duration: 0.35,
    }).to(
      '#modalBody',
      {
        autoAlpha: 1,
        xPercent: 0,
        duration: 0.35,
      },
      '-0.25',
    );

    if (transition === 'close') {
      tl.reverse(2);
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
    <div ref={ref} className="fixed z-50 top-0 left-0 flex h-screen w-full">
      {children}
    </div>
  );
};

export default FilterModalAnimations;
