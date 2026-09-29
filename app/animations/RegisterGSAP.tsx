'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { JSX } from 'react';
import { useLayoutEffect } from 'react';

/**
 * How much faster the global timeline runs under `prefers-reduced-motion: reduce`.
 *
 * Not `0`: a zero time scale pauses the timeline outright and animations never reach their end
 * state, leaving anything that animates in (`autoAlpha: 0` → `1`) invisible forever. A large
 * multiplier finishes every tween within a frame while keeping its end state.
 */
const REDUCED_MOTION_TIME_SCALE = 1000;

/**
 * Register GSAP plugins and honour the reader's motion preference.
 * @see {@link https://gsap.com/cheatsheet/#plugins- gsap cheatsheet}
 * @returns {JSX.Element} - Empty component
 */
const RegisterGSAP = (): JSX.Element => {
  /** Register GSAP plugins on component mount */
  useLayoutEffect(() => {
    /** Register useGSAP and ScrollTrigger plugins */
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    /** Register ScrollToPlugin for smooth scrolling */
    gsap.registerPlugin(ScrollToPlugin);

    /**
     * `prefers-reduced-motion: reduce` collapses every GSAP animation to its end state.
     *
     * `globals.css` already honours the preference for CSS animations, but the GSAP half —
     * which is what actually reveals the catalog cards, the filter drawer and the reviews
     * section — ignored it, so asking for less motion still produced a page of things sliding
     * and fading in. Scaling the global timeline is the one lever that covers every tween,
     * including the ones that set their own `duration`; nothing needs to be edited per
     * component, and no end state changes — elements simply arrive there at once.
     *
     * Reacted to live rather than read once: the preference can be toggled mid-session.
     */
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (reduce: boolean): void => {
      gsap.globalTimeline.timeScale(reduce ? REDUCED_MOTION_TIME_SCALE : 1);
    };

    apply(query.matches);
    const onChange = (event: MediaQueryListEvent): void => apply(event.matches);
    query.addEventListener('change', onChange);

    return () => {
      query.removeEventListener('change', onChange);
    };
  }, []);

  return <></>;
};

export default RegisterGSAP;
