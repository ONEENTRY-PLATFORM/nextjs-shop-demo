'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { useTransitionState } from 'next-transition-router';
import type { FC } from 'react';
import { type ReactNode, useRef } from 'react';

interface SidebarAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Sidebar animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 *
 * @returns Sidebar animations
 */
const SidebarAnimations: FC<SidebarAnimationsProps> = ({
  children,
  className,
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  useGSAP(() => {
    if (
      !ref.current ||
      pathNames[1] === 'profile' ||
      pathNames[1] === 'favorites' ||
      pathNames[1] === 'cart' ||
      pathNames[1] === 'payment' ||
      pathNames[1] === 'orders'
    ) {
      return;
    }

    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.sidebar-menu', {
      xPercent: -100,
    }).to('.sidebar-menu', {
      xPercent: 0,
      duration: 0.7,
    });

    if (stage === 'entering') {
      tl.play();
    } else if (stage === 'leaving') {
      tl.reverse(0.7);
    }

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default SidebarAnimations;
