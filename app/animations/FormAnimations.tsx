'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '../store/providers/OpenDrawerContext';

const FormAnimations = ({
  children,
  isLoading,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  isLoading: boolean;
}) => {
  const { open, transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    if (!open || !ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });
    const elements = (ref.current as HTMLElement).querySelectorAll('form>*');

    tl.set(elements, {
      autoAlpha: 0,
      xPercent: -100,
    }).to(elements, {
      autoAlpha: 1,
      xPercent: 0,
      delay: 0.5,
      stagger: 0.1,
    });

    if (transition === 'close') {
      tl.reverse(1);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [transition, open, isLoading]);

  return <div ref={ref}>{children}</div>;
};

export default FormAnimations;
