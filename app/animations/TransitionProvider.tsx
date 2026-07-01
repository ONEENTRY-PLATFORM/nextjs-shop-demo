'use client';

import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

import { isSidebarRoute } from './navigationRoutes';
import RouteSkeleton from './RouteSkeleton';

/**
 * Transition provider - main 'stage' transition provider
 *
 * Orchestrates the page transition so it reads as a clear sequence:
 * 1. the page's own exit animations play on the still-visible content;
 * 2. the old content is then hidden (not covered) and the destination skeleton
 * fades in over the empty space, while navigation starts;
 * 3. the enter animation reveals the real (or streaming) next page.
 *
 * On sidebar routes only the content column is hidden — the already-loaded left
 * menu is left untouched, so it doesn't disappear or flash a skeleton between
 * sidebar pages.
 * @param   {object}      props          - props
 * @param   {ReactNode}   props.children - children ReactNode
 * @returns {JSX.Element}                TransitionRouter
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @see {@link https://github.com/ismamz/next-transition-router next-transition-router}
 */
export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  /** Reference to the container DOM element (drives the height animation) */
  const ref = useRef<HTMLDivElement>(null);
  /** Wrapper around the page content — the target we hide during navigation */
  const contentRef = useRef<HTMLDivElement>(null);

  /** Whether a page transition is in progress (controls the skeleton overlay) */
  const [isNavigating, setIsNavigating] = useState(false);
  /** Destination href of the pending navigation (picks the matching skeleton) */
  const [targetPath, setTargetPath] = useState<string | null>(null);

  /**
   * Hide the old page content. On sidebar routes only the content column
   * (marked `data-transition-content`) is hidden so the left menu stays put;
   * otherwise the whole content wrapper is hidden. Uses GSAP `autoAlpha`
   * (opacity + visibility) which reliably hides the subtree even when child
   * elements carry their own inline visibility from exit animations.
   * @param {string} [to] - Destination href.
   */
  const hideContent = useCallback((to?: string) => {
    const wrapper = contentRef.current;
    if (!wrapper) {
      return;
    }
    const marked = wrapper.querySelectorAll('[data-transition-content]');
    const targets =
      isSidebarRoute(to ?? null) && marked.length > 0 ? marked : wrapper;
    gsap.set(targets, { autoAlpha: 0 });
  }, []);

  /**
   * Leave animation. The page's own exit animations play first on the visible
   * content during the `leaving` stage; once they've played we hide the old
   * content and reveal the destination skeleton, right as navigation starts.
   * Memoized so state updates don't recreate the callback and churn the
   * router's click delegation.
   */
  const leave = useCallback(
    async (next: () => void, _from?: string, to?: string) => {
      /** Exit early if ref is not available */
      if (!ref.current) {
        return;
      }

      /** Check if we're in browser environment before accessing window */
      if (typeof window === 'undefined') {
        next();
        return;
      }

      /** Create timeline for leave animation */
      const tl = await gsap
        .timeline()
        .to(window, {
          duration: 0.5,
          scrollTo: 0,
        })
        .to(ref.current, {
          height: (ref.current as HTMLDivElement).clientHeight,
          duration: 0.85,
          delay: -0.5,
        })
        .call(
          () => {
            /**
             * Exit animations have played — hide the old content first, then
             * reveal the destination skeleton (it fades in) and navigate.
             */
            hideContent(to);
            setTargetPath(to ?? null);
            setIsNavigating(true);
            next();
          },
          undefined,
          0.75,
        );

      /** Cleanup function to kill timeline on unmount */
      return () => {
        tl.kill();
      };
    },
    [hideContent],
  );

  /**
   * Enter animation — runs once the destination page is mounted. Restores the
   * content wrapper (in case it was hidden) and hides the skeleton overlay so
   * the enter animation reveals the real (or still-streaming) page content.
   */
  const enter = useCallback(async (next: () => void) => {
    /** Destination is mounted: reveal content, hide the skeleton overlay */
    if (contentRef.current) {
      gsap.set(contentRef.current, { autoAlpha: 1 });
    }
    setIsNavigating(false);

    /** Exit early if ref is not available */
    if (!ref.current) {
      next();
      return;
    }

    /** Check if we're in browser environment before accessing window */
    if (typeof window === 'undefined') {
      next();
      return;
    }

    /** Create timeline for enter animation */
    const tl = await gsap
      .timeline()
      .set(ref.current, {
        height: (ref.current as HTMLDivElement).clientHeight,
      })
      .to(ref.current, {
        height: 'auto',
        duration: 0.5,
      })
      .call(next, undefined, 0.5);

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /* Render the transition router with enter and leave animations */
  return (
    <TransitionRouter auto={true} leave={leave} enter={enter}>
      <div ref={ref} className="relative">
        {/* Page content — hidden (only the content column on sidebar routes) while navigating */}
        <div ref={contentRef}>{children}</div>

        {/*
         * Route-aware skeleton overlay. Transparent and fades in — the old
         * content is already hidden, so on sidebar routes the untouched left
         * menu shows through the skeleton's empty sidebar slot.
         */}
        {isNavigating && (
          <div className="skeleton-fade-in absolute inset-0 z-30 overflow-hidden">
            <RouteSkeleton path={targetPath} />
          </div>
        )}
      </div>
    </TransitionRouter>
  );
}
