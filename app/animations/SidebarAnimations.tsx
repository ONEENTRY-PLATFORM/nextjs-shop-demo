'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { ReactNode } from 'react';

const SidebarAnimations = ({ children }: { children: ReactNode }) => {
  const { stage } = useTransitionState();

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.sidebar-menu', {
      xPercent: -100,
    }).to('.sidebar-menu', {
      xPercent: 0,
      duration: 0.5,
    });

    if (stage === 'entering') {
      tl.play();
    } else if (stage === 'leaving') {
      tl.reverse(1);
    }

    return () => {
      tl.kill();
    };
  }, [stage]);

  return children;
};

export default SidebarAnimations;
