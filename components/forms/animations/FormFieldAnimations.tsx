'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useContext, useRef, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface FormFieldAnimationsProps {
  children: ReactNode;
  className: string;
  index: number;
}

/**
 * Form field animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns Form field animations
 */
const FormFieldAnimations: FC<FormFieldAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState<string>('');
  const { open, transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  // Form transition animations
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
        width: 0,
        opacity: 0,
      },
      {
        width: '100%',
        opacity: 1,
        delay: index / 10 + 0.35,
      },
    );
    tl.play();

    if (transition === 'close') {
      tl.reverse(index / 10 + 0.65);
    }

    return () => {
      tl.kill();
    };
  }, [transition, open]);

  // Form stage leaving animations
  useGSAP(() => {
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
        delay: index / 10 + 0.35,
      },
    );

    if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1);
    }
    setPrevStage(stage);

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default FormFieldAnimations;
