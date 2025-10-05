'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Blocks grid animations.
 * @param   {object}      props           - Props for the component.
 * @param   {ReactNode}   props.children  - Children ReactNode to be rendered inside the component.
 * @param   {string}      props.className - CSS className of ref element for styling.
 * @returns {JSX.Element}                 A blocks grid component with animations applied.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const BlocksGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  // Get current transition stage
  const { stage } = useTransitionState();
  // State to track the previous transition stage
  const [prevStage, setPrevStage] = useState('');
  // Reference to the DOM element for animations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  // Stage entering/leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true, // Create a new GSAP timeline and pause it initially
    });

    // If the stage is 'entering' and the previous stage was 'leaving', animate in
    if (stage === 'entering' && prevStage === 'leaving') {
      tl.set(ref.current, {
        autoAlpha: 0, // Initial state: hidden
      }).to(ref.current, {
        autoAlpha: 1, // Animate to visible state
      });
      tl.play(); // Play the timeline
    }

    // If the stage is 'leaving' and the previous stage was 'none', animate out
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0, // Animate to hidden state
      });
      tl.play(); // Play the timeline
    }

    setPrevStage(stage); // Update the previous stage

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [stage]);

  // Render the component with the provided className and children
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default BlocksGridAnimations; // Export the component as the default export
