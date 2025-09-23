'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { type ReactNode, useRef } from 'react';

interface BreadcrumbsAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Breadcrumbs animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns JSX.Element with gsap animations
 */
const BreadcrumbsAnimations: FC<BreadcrumbsAnimationsProps> = ({
  children,
  className,
}) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);
  const ref = useRef(null);

  const hidden = pathNames.length < 2;

  // hidden animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline();

    if (hidden) {
      tl.to(ref.current, {
        yPercent: -100,
        autoAlpha: 0,
        height: 0,
        duration: 0.15,
      });
    } else {
      tl.to(ref.current, {
        display: 'flex',
        yPercent: 0,
        height: 'auto',
        autoAlpha: 1,
        duration: 0.35,
      });
    }

    return () => {
      tl.kill();
    };
  }, [hidden]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default BreadcrumbsAnimations;
