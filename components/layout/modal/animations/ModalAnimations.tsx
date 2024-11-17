'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Modal open/close animations
 * @param children children ReactNode
 * @param component
 *
 * @returns Modal wrapper with open/close animations
 */
const ModalAnimations: FC<{ children: ReactNode; component: string }> = ({
  children,
  component,
}) => {
  const { open, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current || !open) {
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

    const modalBg = (ref.current as HTMLDivElement).querySelector('#modalBg');
    const modalBody = (ref.current as HTMLDivElement).querySelector(
      '#modalBody',
    );

    if (transition === 'close') {
      const duration = component !== 'CalendarForm' ? 0.5 : 1.5;
      tl.to([modalBg, modalBody], {
        scaleX: 1,
        autoAlpha: 1,
        duration: duration,
      }).reverse(duration);
    } else {
      tl.set([modalBg, modalBody], {
        scaleX: 0,
        autoAlpha: 0,
      })
        .to([modalBg, modalBody], {
          scaleX: 1,
          autoAlpha: 1,
        })
        .to(modalBg, {
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
