'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useContext } from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';

import TransitionContext from './TransitionContext';

gsap.registerPlugin(useGSAP);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransitionComponent: FC<{ children: any }> = ({ children }) => {
  const paths = usePathname();
  const { toggleCompleted } = useContext(TransitionContext);

  return (
    <SwitchTransition>
      <Transition
        key={paths}
        timeout={500}
        onEnter={(node: gsap.TweenTarget) => {
          console.log(node);
          toggleCompleted(false);
          gsap.set(node, { autoAlpha: 0, scale: 0.8, xPercent: -100 });
          gsap
            .timeline({
              paused: true,
              onComplete: () => toggleCompleted(true),
            })
            .to(node, { autoAlpha: 1, xPercent: 0, duration: 0.25 })
            .to(node, { scale: 1, duration: 0.25 })
            .play();
        }}
        onExit={(node: gsap.TweenTarget) => {
          console.log(node);
          
          gsap
            .timeline({ paused: true })
            .to(node, { scale: 0.8, duration: 0.2 })
            .to(node, { xPercent: 100, autoAlpha: 0, duration: 0.2 })
            .play();
        }}
      >
        {children}
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;
