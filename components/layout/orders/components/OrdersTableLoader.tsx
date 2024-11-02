'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTransitionState } from 'next-transition-router';
import { type FC, type ReactNode, useRef } from 'react';

import type { LoaderProps } from '@/app/types/global';

const TableAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    const lines =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.relative');

    tl.set(lines, {
      autoAlpha: 0,
    }).to(lines, {
      autoAlpha: 1,
      duration: 0.15,
      stagger: 0.05,
    });

    tl.play();

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

const OrdersTableLoader: FC<LoaderProps> = ({ limit }) => {
  return (
    <TableAnimations className="my-auto flex w-full flex-col max-md:max-w-full">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="relative -mb-px flex h-12 border-collapse gap-4 border-y p-4"
        >
          <div className="animate-loader h-full w-1/2"></div>
          <div className="animate-loader h-full w-1/4"></div>
          <div className="animate-loader h-full w-1/4"></div>
        </div>
      ))}
    </TableAnimations>
  );
};

export default OrdersTableLoader;
