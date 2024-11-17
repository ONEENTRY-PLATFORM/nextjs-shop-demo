'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

interface CardsGridAnimationsProps {
  children: ReactNode;
  className: string;
}
/**
 * CardsGrid animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 *
 * @returns CardsGrid animations
 */
const CardsGridAnimations: FC<CardsGridAnimationsProps> = ({
  children,
  className,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      const cards =
        ref.current &&
        (ref.current as HTMLDivElement).querySelectorAll('.in-view');

      tl.to(cards, {
        autoAlpha: 0,
        scale: 0,
        duration: 0.45,
        stagger: 0.05,
      }).to(ref.current, {
        autoAlpha: 0,
        duration: 0.35,
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

export default CardsGridAnimations;
