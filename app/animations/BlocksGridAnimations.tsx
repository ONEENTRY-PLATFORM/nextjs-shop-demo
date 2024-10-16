'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

const BlocksGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  // first load animations
  // useGSAP(() => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   const tl = gsap.timeline({
  //     repeat: 0,
  //   });

  //   if (stage !== 'entering') {
  //     tl.set(ref.current, {
  //       opacity: 0,
  //       scale: 0,
  //     }).to(ref.current, {
  //       opacity: 1,
  //       scale: 1,
  //       duration: 0.5,
  //       delay: 0.5,
  //     });
  //   }

  //   return () => {
  //     tl.kill();
  //   };
  // }, [ref]);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    // tl.to('.block-card', {
    //   autoAlpha: 1,
    //   scale: 1,
    //   yPercent: 0,
    //   delay: 0.5,
    //   stagger: 0.05,
    // });

    if (stage === 'leaving') {
      tl.set('.block-card', {
        autoAlpha: 1,
        scale: 1,
      }).to('.block-card', {
        autoAlpha: 0,
        scale: 0.5,
        stagger: 0.05,
      });
      tl.play();
    }
    if (stage === 'entering') {
      tl.set('.block-card', {
        autoAlpha: 0,
        scale: 0,
        yPercent: 0,
      }).to('.block-card', {
        autoAlpha: 1,
        scale: 1,
        yPercent: 0,
        stagger: 0.05,
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
