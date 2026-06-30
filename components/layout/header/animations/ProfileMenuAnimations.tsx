'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Profile menu animations component for handling entrance and exit animations of the profile menu.
 * Uses GSAP to animate the profile menu when it opens or closes based on state changes.
 * @param   {object}      props           - Profile menu animations props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - CSS className of ref element.
 * @param   {boolean}     props.state     - whether the menu is open.
 * @returns {JSX.Element}                 Profile menu wrapper with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProfileMenuAnimations = ({
  children,
  className,
  state,
}: {
  children: ReactNode;
  className: string;
  state: boolean;
}): JSX.Element => {
  /**
   * Reference to the DOM element for animations
   * This ref is used by GSAP to directly manipulate the DOM element
   */
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Animate the dropdown open/closed whenever `state` changes.
   * A single tween toward the target values keeps open and close symmetric;
   * GSAP's auto-overwrite kills any in-flight tween, so rapid hover on/off
   * stays smooth instead of flashing.
   */
  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    gsap.to(ref.current, {
      autoAlpha: state ? 1 : 0, // visibility + opacity
      height: state ? 'auto' : 0, // expand to content / collapse
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [state]); // Re-run the animation when the open state changes

  /* Container element with ref attachment for GSAP animations */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ProfileMenuAnimations;
