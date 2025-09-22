/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

// Interface defining the props expected by the BlockCardAnimations component
interface BlockCardAnimationsProps {
  children: ReactNode; // The child elements to be rendered inside the component
  className: string; // CSS class name for styling the card
  index: number; // Index of the element for staggered animation effects
}

/**
 * Blocks card animations
 *
 * @param children - Children ReactNode to be rendered inside the component
 * @param className - Card wrapper className for styling
 * @param index - Index of element in array for stagger effect
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns A card component with animations applied
 */
const BlockCardAnimations: FC<BlockCardAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState(); // Get current transition stage
  const [prevStage, setPrevStage] = useState(''); // State to track the previous transition stage
  const ref = useRef<HTMLDivElement>(null); // Reference to the DOM element for animations

  // Intro animations
  useGSAP(() => {
    const tl = gsap.timeline(); // Create a new GSAP timeline

    // If the current stage is 'none' and there was no previous stage, set initial properties and animate in
    if (stage === 'none' && prevStage === '') {
      tl.set(ref.current, {
        // Initial state: hidden
        autoAlpha: 0,
      }).to(ref.current, {
        // Animate to visible state
        autoAlpha: 1,
        duration: 0.35, // Animation duration
        delay: index / 10, // Stagger delay based on index
      });
    }

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, []);

  // Stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline(); // Create a new GSAP timeline

    // If the stage is 'leaving' and the previous stage was 'none', animate out
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scale: 0, // Scale down to 0
        duration: 0.35, // Animation duration
        delay: index / 20, // Stagger delay based on index
      });
    }

    // If returning to 'none' from 'entering', reset and animate images
    if (stage === 'none' && prevStage === 'entering') {
      tl.set((ref.current as any)?.getElementsByTagName('img'), {
        scale: 0,
        autoAlpha: 0,
      }).to((ref.current as any)?.getElementsByTagName('img'), {
        scale: 1,
        autoAlpha: 1,
        duration: 0.5, // Animation duration
        delay: index / 10, // Stagger delay based on index
      });
    }

    setPrevStage(stage); // Update the previous stage

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [stage]);

  // Render the component with the provided className and children
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default BlockCardAnimations; // Export the component as the default export
