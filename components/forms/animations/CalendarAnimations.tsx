'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

interface CalendarAnimationsProps {
  children: ReactNode;
  className: string;
}

/**
 * Calendar animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 *
 * @returns Calendar animations
 */
const CalendarAnimations: FC<CalendarAnimationsProps> = ({
  children,
  className,
}) => {
  const { open, transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  // Form transition animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }

    const tl = gsap.timeline({
      paused: true,
    });

    tl.fromTo(
      '.react-calendar__month-view__weekdays__weekday abbr, #modalBody > div button',
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        delay: 0.15,
        stagger: 0.01,
      },
    );

    if (transition === 'close') {
      tl.reverse(2);
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
    };
  }, [transition, open]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CalendarAnimations;
