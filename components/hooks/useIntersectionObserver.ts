'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for observing element visibility using Intersection Observer API.
 * @param   {IntersectionObserverInit} options            - IntersectionObserver options.
 * @param   {Element | null}           options.root       - The element that is used as the viewport for checking visibility of the target.
 * @param   {string}                   options.rootMargin - Margin around the root. Can be used to add some padding around the root element.
 * @param   {number | number[]}        options.threshold  - The threshold value or array of values that indicate when an element is considered visible.
 * @returns {object}                                      Object containing ref and visibility state.
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '20px',
    threshold: 0.1,
  },
): object => {
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
