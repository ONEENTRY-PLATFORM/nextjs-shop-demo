'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX } from 'react';
import { useRef, useState } from 'react';

import type { AnimationsProps } from '@/app/types/global';

/**
 * Cart wrapper stage leaving animations.
 * @param   {AnimationsProps} props           - Cart wrapper props.
 * @param   {ReactNode}       props.children  - children ReactNode.
 * @param   {string}          props.className - cart wrapper className.
 * @returns {JSX.Element}                     cart wrapper with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CartAnimations = ({
  children,
  className,
}: AnimationsProps): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState<string>('');
  const ref = useRef(null);

  // stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        gsap.set(productElements, {
          autoAlpha: 0,
          yPercent: 100,
        });
      },
    });

    // Check if elements exist before creating animation
    const productElements = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('.product-in-cart')
      : [];
    const trElements = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('.tr')
      : [];
    const totalElement = ref.current
      ? (ref.current as HTMLElement).querySelectorAll('#total')
      : [];

    // Only create timeline if elements exist
    if (
      productElements.length > 0 ||
      trElements.length > 0 ||
      totalElement.length > 0
    ) {
      tl.set([productElements, trElements, totalElement], {
        autoAlpha: 0,
        yPercent: 100,
      })
        .to(productElements, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.1,
          delay: 0.35,
        })
        .to([trElements, totalElement], {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.1,
        });

      if (stage === 'leaving' && prevStage === 'none') {
        tl.reverse(1.2);
      }

      setPrevStage(stage);
    }

    return () => {
      tl.kill();
    };
  }, [stage, prevStage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CartAnimations;
