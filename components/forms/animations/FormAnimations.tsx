'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface FormAnimationsProps {
  children: ReactNode;
  isLoading: boolean;
}

/**
 * Form animations
 * @param children children ReactNode
 * @param isLoading loading state
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns Form animations
 */
const FormAnimations: FC<FormAnimationsProps> = ({ children, isLoading }) => {
  const { open, transition, setTransition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  // Form transition animations
  useGSAP(() => {
    if (!open || !ref.current || isLoading) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setTransition('');
      },
      onReverseComplete: () => {
        setTransition('');
      },
    });

    tl.from(ref.current, {
      autoAlpha: 0,
    }).to(ref.current, {
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
  }, [transition, open, isLoading]);

  return <div ref={ref}>{children}</div>;
};

export default FormAnimations;
