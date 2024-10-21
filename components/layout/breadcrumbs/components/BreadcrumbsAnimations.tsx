'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
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
  const ref = useRef(null);

  const hidden = pathNames.length < 2;

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (hidden) {
      tl.to(ref.current, {
        yPercent: -100,
        autoAlpha: 0,
        display: 'none',
        duration: 0.2,
      }).play();
    } else {
      tl.to(ref.current, {
        display: 'flex',
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.2,
      }).play();
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
