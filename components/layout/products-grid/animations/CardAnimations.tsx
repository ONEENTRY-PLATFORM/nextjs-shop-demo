'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useSearchParams } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Card animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 * @param pagesLimit used for animations
 *
 * @returns Card animations
 */
const CardAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
  pagesLimit: number;
}> = ({ children, className, index, pagesLimit }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const ref = useRef(null);
  const delay = (index - (currentPage - 1) * pagesLimit) / 10;
  const inView = ref.current && ScrollTrigger.isInViewport(ref.current, 0.05);

  // entering animations
  useGSAP(() => {
    const tl = gsap.timeline({});

    const img =
      ref.current &&
      (ref.current as HTMLDivElement).getElementsByTagName('img');

    tl.set(ref.current, {
      autoAlpha: 0,
      scale: 0,
    })
      .set(img, {
        autoAlpha: 0,
      })
      .to(ref.current, {
        autoAlpha: 1,
        scale: 1,
        delay: delay > 0 ? delay : 0,
        duration: 0.6,
      })
      .to(img, {
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
      });

    return () => {
      tl.kill();
    };
  }, []);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    if (inView === true || inView === null) {
      (ref.current as HTMLDivElement).classList.add('in-view');
    } else {
      (ref.current as HTMLDivElement).classList.remove('in-view');
    }
  }, [inView]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default CardAnimations;
