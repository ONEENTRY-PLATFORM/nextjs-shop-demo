'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useTransitionState } from 'next-transition-router';
import { type ReactNode, useRef } from 'react';

const BreadcrumbsAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  const { stage } = useTransitionState();
  const ref = useRef(null);

  const hidden = pathNames.length < 2;

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      yPercent: 100,
      autoAlpha: 0,
    }).to(ref.current, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.5,
      stagger: 0.05,
    });

    if (stage === 'leaving' || hidden) {
      tl.reverse(1);
    } else if (stage === 'entering') {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [stage, hidden]);

  if (hidden) {
    return;
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default BreadcrumbsAnimations;
