'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { JSX } from 'react';
import { type ReactNode, useRef } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Table animations
 * @param   {object}      props           - Props
 * @param   {ReactNode}   props.children  - Children
 * @param   {string}      props.className - Class name
 * @returns {JSX.Element}                 JSX.Element
 */
const TableAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    const lines =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.relative');

    tl.to(lines, {
      autoAlpha: 1,
      duration: 0.15,
      stagger: 0.05,
    });

    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/**
 * Orders table loader
 * @param   {LoaderProps} props       - Loader props
 * @param   {number}      props.limit - Limit
 * @returns {JSX.Element}             JSX.Element
 */
const OrdersTableLoader = ({ limit }: LoaderProps): JSX.Element => {
  return (
    <TableAnimations className="my-auto flex w-full max-w-[730px] flex-col max-md:max-w-full">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="relative -mb-px flex h-12 border-collapse gap-4 border-y p-4 opacity-0"
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
