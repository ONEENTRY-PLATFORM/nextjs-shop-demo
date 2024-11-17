'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Mobile menu open/close animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param id
 *
 * @returns Mobile menu wrapper with animations
 */
const MobileMenuAnimations: FC<{
  children: ReactNode;
  className: string;
  id: string;
}> = ({ children, className, id }) => {
  const { open, transition, setOpen, setTransition } =
    useContext(OpenDrawerContext);
  const ref = useRef(null);

  // open/close animations
  useGSAP(() => {
    if (!open) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    if (transition === 'close') {
      tl.to('#modalBg, #modalBody', {
        xPercent: -150,
        autoAlpha: 0,
        onComplete: () => {
          setTransition('');
          setOpen(false);
        },
      }).play();
    } else if (open) {
      tl.set('#modalBg, #modalBody', {
        xPercent: -150,
        autoAlpha: 0,
      })
        .to('#modalBg, #modalBody', {
          xPercent: -50,
          autoAlpha: 1,
        })
        .to('#modalBg', {
          backdropFilter: 'blur(10px)',
          delay: -0.35,
        })
        .play();
    }

    return () => {
      tl.kill();
    };
  }, [open, transition]);

  if (!open) {
    return;
  }

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
};

export default MobileMenuAnimations;
