/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Profile menu animations on state change.
 *
 * @param props - Profile menu animations props.
 * @param props.children - children ReactNode.
 * @param props.className - CSS className of ref element.
 * @param props.state - state of component.
 * @param props.setState - setState of component function.
 *
 * @returns Profile menu wrapper with animations.
 *
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProfileMenuAnimations = ({
  children,
  className,
  state,
  setState,
}: {
  children: ReactNode;
  className: string;
  state: any;
  setState: any;
}): JSX.Element => {
  const ref = useRef(null);

  // animations on state change
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.from(ref.current, {
      autoAlpha: 0,
      height: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      height: 'auto',
      duration: 0.5,
    });
    if (state) {
      tl.play();
    } else {
      tl.reverse(0.5);
    }

    return () => {
      tl.kill();
    };
  }, [state]);

  return (
    <div ref={ref} className={className} onMouseLeave={() => setState(false)}>
      {children}
    </div>
  );
};

export default ProfileMenuAnimations;
