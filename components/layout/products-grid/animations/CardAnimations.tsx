'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useSearchParams } from 'next/navigation';
import type { JSX, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CardAnimations component provides entrance animations for product cards using GSAP.
 * It animates cards with a staggered fade-in and scale effect based on their position in the grid.
 * The animation timing is adjusted based on the current page and item index to create a smooth
 * sequential animation effect as the user scrolls through paginated content.
 * @param   {object}      props            - Component properties
 * @param   {ReactNode}   props.children   - Children ReactNode elements to be animated
 * @param   {string}      props.className  - CSS className to apply to the wrapper element
 * @param   {number}      props.index      - Index of the element for animation staggering calculation
 * @param   {number}      props.pagesLimit - Number of items per page, used for calculating animation delays
 * @returns {JSX.Element}                  A div element containing the animated children with entrance animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CardAnimations = ({
  children,
  className,
  index,
  pagesLimit,
}: {
  children: ReactNode;
  className: string;
  index: number;
  pagesLimit: number;
}): JSX.Element => {
  /** Get current search parameters to determine the active page */
  const searchParams = useSearchParams();
  /** Extract current page number from URL parameters, default to 1 */
  const currentPage = Number(searchParams.get('page')) || 1;

  /** Reference to the DOM element for animation targeting */
  const ref = useRef(null);
  /** State to track if element is in viewport */
  const [inView, setInView] = useState<boolean | null>(null);
  /** Calculate animation delay based on item position relative to current page */
  const delay = (index - (currentPage - 1) * pagesLimit) / 10;

  /** Check if element is in viewport for scroll-triggered animations */
  useEffect(() => {
    /** Only run on client side where window is available */
    if (typeof window === 'undefined') {
      return;
    }

    const checkInView = () => {
      if (ref.current && typeof window !== 'undefined') {
        setInView(ScrollTrigger.isInViewport(ref.current, 0.05));
      }
    };

    // Check on mount and when ScrollTrigger updates
    checkInView();

    // Listen for ScrollTrigger refresh events
    ScrollTrigger.addEventListener('refresh', checkInView);

    // Cleanup listener
    return () => {
      ScrollTrigger.removeEventListener('refresh', checkInView);
    };
  }, []);

  /** Entering animations using GSAP timeline */
  useGSAP(() => {
    const el = ref.current as HTMLDivElement | null;
    if (!el) {
      return;
    }

    /**
     * Cards containing a `script[data-painted]` marker arrived with the
     * initially-streamed HTML document and are already visible on screen
     * (React attaches to them long after first paint). Running the entrance
     * animation would reset the whole painted catalog to
     * `autoAlpha: 0 / scale: 0` and replay the stagger — users see the
     * entire grid flash (worst with slow hydration: reload with ?page=N,
     * dev mode). The marker script (see ProductCard) only executes during
     * HTML parsing, so cards mounted client-side (load-more appends, client
     * navigations) still animate.
     */
    if (el.querySelector('script[data-painted]')) {
      return;
    }

    /** Get image elements within the card for separate animation */
    const img = el.getElementsByTagName('img');

    /**
     * Hide the card synchronously, inside this pre-paint layout effect.
     * A timeline's `.set()` only applies on the next GSAP tick — under a
     * busy main thread (RSC payload rendering, dev compilation) that tick
     * lands well after the browser has painted the mounted card, so the
     * card flashes visible before being hidden and re-animated. A direct
     * `gsap.set()` renders immediately, before first paint.
     */
    gsap.set(el, {
      autoAlpha: 0,
      scale: 0,
    });
    gsap.set(img, {
      autoAlpha: 0,
    });

    /** Create a timeline for the coordinated entrance sequence */
    const tl = gsap
      .timeline({})
      .to(el, {
        autoAlpha: 1,
        scale: 1,
        delay: delay > 0 ? delay : 0,
        duration: 0.6,
      })
      .to(img, {
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
      });

    /** Cleanup function to kill timeline on component unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /** Handle scroll-triggered class changes for additional animations */
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    /** Add or remove 'in-view' class based on viewport visibility */
    if (inView === true || inView === null) {
      (ref.current as HTMLDivElement).classList.add('in-view');
    } else {
      (ref.current as HTMLDivElement).classList.remove('in-view');
    }
  }, [inView]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default CardAnimations;
