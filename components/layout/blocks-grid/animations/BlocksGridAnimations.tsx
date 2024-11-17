'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

interface BlocksGridAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Blocks grid animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 *
 * @returns blocks grid with animations
 */
const BlocksGridAnimations: FC<BlocksGridAnimationsProps> = ({
  children,
  className,
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  // stage entering/leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving') {
      tl.to(ref.current, {
        autoAlpha: 0,
      });
      tl.play();
    }
    if (stage === 'entering') {
      tl.set(ref.current, {
        autoAlpha: 0,
      }).to(ref.current, {
        autoAlpha: 1,
      });
      tl.play();
    }

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

export default BlocksGridAnimations;
