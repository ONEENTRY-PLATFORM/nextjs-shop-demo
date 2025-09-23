'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

// Interface defining the props expected by the BlocksGridAnimations component
interface BlocksGridAnimationsProps {
  children: ReactNode; // The child elements to be rendered inside the component
  className: string; // CSS class name for styling the grid
}

/**
 * Blocks grid animations
 *
 * @param children - Children ReactNode to be rendered inside the component
 * @param className - CSS className of ref element for styling
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns A blocks grid component with animations applied
 */
const BlocksGridAnimations: FC<BlocksGridAnimationsProps> = ({
  children,
  className,
}) => {
  const { stage } = useTransitionState(); // Get current transition stage
  const [prevStage, setPrevStage] = useState(''); // State to track the previous transition stage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null); // Reference to the DOM element for animations

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
