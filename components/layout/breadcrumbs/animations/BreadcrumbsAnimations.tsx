'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { type ReactNode, useRef } from 'react';

/**
 * Breadcrumbs animations component that handles show/hide animations for breadcrumbs
 * Uses GSAP library to animate the breadcrumbs container based on navigation depth
 * Automatically hides breadcrumbs on shallow routes (less than 2 path segments)
 * @param   {object}      props           - Breadcrumbs animations props
 * @param   {ReactNode}   props.children  - Child elements to be animated (breadcrumbs content)
 * @param   {string}      props.className - CSS class names for styling the breadcrumbs wrapper
 * @returns {JSX.Element}                 Breadcrumbs container with entrance/exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const BreadcrumbsAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get current pathname from Next.js router */
  const paths = usePathname();

  /** Split pathname into segments and filter out empty segments */
  const pathNames = paths.split('/').filter((path: unknown) => path);

  /** Reference to the breadcrumbs wrapper element for GSAP animations */
  const ref = useRef(null);

  /** Determine if breadcrumbs should be hidden (when path depth is less than 2) */
  const hidden = pathNames.length < 2;

  /**
   * GSAP animation effect for showing/hiding breadcrumbs based on navigation depth
   * Handles both entrance animation (showing breadcrumbs) and exit animation (hiding breadcrumbs)
   */
  useGSAP(() => {
    /** Exit early if ref is not available */
    if (!ref.current) {
      return;
    }

    /** Create GSAP timeline for animations */
    const tl = gsap.timeline();

    /** Hide breadcrumbs when on shallow routes (less than 2 path segments) */
    if (hidden) {
      tl.to(ref.current, {
        yPercent: -100, // Move element up by 100% of its height
        autoAlpha: 0, // Fade out element
        height: 0, // Collapse height to 0
        duration: 0.15, // Quick animation duration
      });
    } else {
      /** Show breadcrumbs when on deeper routes (2 or more path segments) */
      tl.to(ref.current, {
        display: 'flex', // Ensure display is set to flex
        yPercent: 0, // Reset vertical position
        height: 'auto', // Restore natural height
        autoAlpha: 1, // Fade in element
        duration: 0.35, // Slightly longer animation duration
      });
    }

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [paths]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default BreadcrumbsAnimations;
