'use client';

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverResult {
  /** Ref to attach to the observed element */
  ref: RefObject<HTMLDivElement | null>;
  /** Whether the element is currently in the viewport */
  isIntersecting: boolean;
  /** Whether the element has entered the viewport at least once */
  hasIntersected: boolean;
}

/** Stable default options — inline defaults would recreate the observer on every render */
const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '20px',
  threshold: 0.1,
};

/**
 * Custom hook for observing element visibility using Intersection Observer API.
 *
 * Pass a stable (module-level or memoized) options object — a new object on
 * every render recreates the observer.
 * @param   {IntersectionObserverInit}   options            - IntersectionObserver options.
 * @param   {Element | null}             options.root       - The element that is used as the viewport for checking visibility of the target.
 * @param   {string}                     options.rootMargin - Margin around the root. Can be used to add some padding around the root element.
 * @param   {number | number[]}          options.threshold  - The threshold value or array of values that indicate when an element is considered visible.
 * @returns {IntersectionObserverResult}                    Object containing ref and visibility state.
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = DEFAULT_OPTIONS,
): IntersectionObserverResult => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const intersecting = entry.isIntersecting;
      setIsIntersecting(intersecting);

      if (intersecting) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return { ref, isIntersecting, hasIntersected };
};
