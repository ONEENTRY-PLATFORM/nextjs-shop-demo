'use client';

import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useContext } from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';

import TransitionContext from './TransitionContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransitionComponent: FC<{ children: any }> = ({ children }) => {
  const paths = usePathname();
  const { toggleCompleted } = useContext(TransitionContext);

  return (
    <SwitchTransition>
      <Transition
        key={paths}
        timeout={0}
        onEnter={(node: gsap.TweenTarget) => {
          toggleCompleted(false);
          gsap.set(node, { autoAlpha: 0 });
          gsap
            .timeline({
              paused: true,
              onComplete: () => toggleCompleted(true),
            })
            .to(node, { autoAlpha: 1, duration: 0.5 })
            .play();
        }}
        onExit={(node: gsap.TweenTarget) => {
          gsap
            .timeline({ paused: true })
            .to(node, { autoAlpha: 0, duration: 0.5 })
            .play();
        }}
      >
        {children}
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;
