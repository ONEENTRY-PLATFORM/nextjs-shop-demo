'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Filter modal animations
 * @param children children ReactNode
 *
 * @returns filter modal with animations
 */
const FilterModalAnimations: FC<{ children: ReactNode }> = ({ children }) => {
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

    const modalBg =
      ref.current && (ref.current as HTMLDivElement).querySelector('#modalBg');
    const modalBody =
      ref.current &&
      (ref.current as HTMLDivElement).querySelector('#modalBody');

    gsap.set(modalBg, {
      autoAlpha: 0,
      transformOrigin: 'right center',
    });

    gsap.set(modalBody, {
      xPercent: 100,
    });

    tl.to(modalBg, {
      autoAlpha: 1,
      xPercent: 0,
      backdropFilter: 'blur(10px)',
      duration: 0.5,
    }).to(
      modalBody,
      {
        autoAlpha: 1,
        xPercent: 0,
        duration: 0.5,
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
    <div ref={ref} className="fixed left-0 top-0 z-50 flex h-screen w-full">
      {children}
    </div>
  );
};

export default FilterModalAnimations;
