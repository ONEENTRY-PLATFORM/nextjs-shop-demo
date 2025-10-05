'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Payment method animations.
 * @param children.children
 * @param children           - children ReactNode.
 * @param className          - CSS className of ref element.
 * @param index              - Index of element for animations stagger.
 * @param isActive           - Is active element.
 * @param children.className
 * @param children.isActive
 * @param children.index
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns                  Payment method animations.
 */
const PaymentMethodAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
  isActive: boolean;
}> = ({ children, className, isActive, index }): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    gsap.set(ref.current, {
      transformOrigin: '0 0',
    });

    const tl = gsap.timeline({
      paused: true,
    });

    const cartData = (ref.current as HTMLDivElement).querySelector('#cartData');

    if (isActive) {
      tl.fromTo(
        ref.current,
        {
          height: 110,
        },
        {
          height: 'auto',
        },
      )
        .to(cartData, {
          autoAlpha: 1,
          delay: -0.5,
        })
        .play();
    } else {
      tl.to(ref.current, {
        height: 110,
      })
        .to(cartData, {
          autoAlpha: 0,
          delay: -0.5,
        })
        .play();
    }

    return () => {
      tl.kill();
    };
  }, [isActive]);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        delay: index / 10,
      }).play();
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

export default PaymentMethodAnimations;
