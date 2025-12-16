'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { JSX } from 'react';
import { type ReactNode, useRef } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Table animations component.
 * Provides fade-in animations for table rows using GSAP.
 * @param   {object}      props           - Component props
 * @param   {ReactNode}   props.children  - Child components to be animated
 * @param   {string}      props.className - CSS class name for the wrapper element
 * @returns {JSX.Element}                 Animated wrapper element
 */
const TableAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /** GSAP animation hook for table row fade-in transitions */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Select all rows with the 'relative' class for animation */
    const lines =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.relative');

    /** Animate the rows with staggered fade-in effect */
    tl.to(lines, {
      autoAlpha: 1,
      duration: 0.15,
      stagger: 0.05,
    });

    /** Play the animation timeline */
    tl.play();

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /** Render the animated wrapper element */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/**
 * Orders table loader component.
 * Displays skeleton loaders for orders table rows while data is loading.
 * @param   {LoaderProps} props       - Loader component props
 * @param   {number}      props.limit - Number of loader rows to display
 * @returns {JSX.Element}             Orders table loader with animated skeleton rows
 */
const OrdersTableLoader = ({ limit }: LoaderProps): JSX.Element => {
  /** Render the table loader with animated rows */
  return (
    <TableAnimations className="my-auto flex w-full max-w-182.5 flex-col max-md:max-w-full">
      {/** Generate skeleton loader rows based on the limit */}
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="relative -mb-px flex h-12 border-collapse gap-4 border-y p-4 opacity-0"
        >
          {/** First column loader - wider to represent date field */}
          <div className="animate-loader h-full w-1/2"></div>
          {/** Second column loader - medium width for price field */}
          <div className="animate-loader h-full w-1/4"></div>
          {/** Third column loader - medium width for status field */}
          <div className="animate-loader h-full w-1/4"></div>
        </div>
      ))}
    </TableAnimations>
  );
};

export default OrdersTableLoader;
