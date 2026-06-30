'use client';

import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

import { NavigationContext } from './NavigationContext';
import { isSidebarRoute } from './navigationRoutes';
import RouteSkeleton from './RouteSkeleton';

/**
 * Transition provider - main 'stage' transition provider
 *
 * On top of the GSAP enter/leave page animations, it renders a route-aware
 * skeleton overlay as soon as navigation starts (the `leaving` stage), so the
 * user sees the destination's skeleton immediately on click — before the next
 * page has loaded — instead of only after the transition completes.
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
  /** Reference to the container DOM element */
  const ref = useRef(null);

  /** Whether a page transition is in progress (controls the skeleton overlay) */
  const [isNavigating, setIsNavigating] = useState(false);
  /** Destination href of the pending navigation (picks the matching skeleton) */
  const [targetPath, setTargetPath] = useState<string | null>(null);

  /**
   * Leave animation. The page's own exit animations (cards fading/scaling out,
   * etc.) play first on the still-visible content during the `leaving` stage;
   * only once they've finished do we hide the old content and reveal the
   * destination skeleton — right as navigation starts. Memoized so state
   * updates don't recreate the callback and churn the router's click delegation.
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
             * Exit animations have played — now hide the old content and show
             * the destination skeleton, then start the actual navigation.
             */
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
    [],
  );

  /**
   * Enter animation — runs once the destination page is mounted. Hides the
   * skeleton overlay at the start so the enter animation reveals the real
   * (or still-streaming) page content.
   */
  const enter = useCallback(async (next: () => void) => {
    /** Destination is mounted: hide the skeleton overlay */
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

  /**
   * Keep the sidebar menu visible when navigating between sidebar routes — the
   * page content is hidden, but the already-loaded menu must stay on screen.
   */
  const keepSidebar = isNavigating && isSidebarRoute(targetPath);

  /* Render the transition router with enter and leave animations */
  return (
    <NavigationContext.Provider value={{ keepSidebar }}>
      <TransitionRouter auto={true} leave={leave} enter={enter}>
        <div ref={ref} className="relative">
          {/*
           * Old page content. While navigating it's hidden (not covered) so it
           * is removed cleanly without a background — the overlay below shows
           * the destination skeleton in its place. `visibility: hidden` keeps
           * the box height for the GSAP collapse/expand animation.
           */}
          <div style={{ visibility: isNavigating ? 'hidden' : undefined }}>
            {children}
          </div>

          {/*
           * Route-aware skeleton overlay shown the moment navigation starts.
           * Transparent — the old content is hidden, not painted over, so on
           * sidebar routes the real menu shows through the empty sidebar slot.
           */}
          {isNavigating && (
            <div className="absolute inset-0 z-30 overflow-hidden">
              <RouteSkeleton path={targetPath} />
            </div>
          )}
        </div>
      </TransitionRouter>
    </NavigationContext.Provider>
  );
}
