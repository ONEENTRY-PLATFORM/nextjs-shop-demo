'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

interface CategoriesGridAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Categories grid stage leaving animations
 * @param children children ReactNode
 * @param className categories grid wrapper className
 *
 * @returns categories grid wrapper with animations
 */
const CategoriesGridAnimations: FC<CategoriesGridAnimationsProps> = ({
  children,
  className,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState<string>('');
  const ref = useRef(null);

  // stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
      });
      tl.play();
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

export default CategoriesGridAnimations;
