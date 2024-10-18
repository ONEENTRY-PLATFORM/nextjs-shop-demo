'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransitionState } from 'next-transition-router';
import type { FC } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoadMore: FC<{ totalPages: number }> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 0;

  const { stage, isReady } = useTransitionState();
  const ref = useRef(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  }, []);

  const goToNextPage = () => {
    const nextPage = (currentPage < 1 ? 1 : currentPage) + 1;
    if (currentPage >= totalPages) {
      return;
    }
    router.push(
      pathname +
        '?' +
        createQueryString(
          'page',
          (nextPage <= totalPages ? nextPage : currentPage).toString(),
        ),
    );
    // ScrollTrigger.refresh();
  };

  useGSAP(() => {
    if (stage !== 'none' || !isReady) {
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      onEnter: () => {
        goToNextPage();
      },
      onLeave: () => {
        // ScrollTrigger.refresh();
      },
      // markers: {
      //   startColor: 'black',
      //   endColor: 'black',
      //   fontSize: '14px',
      //   indent: 20,
      // },
    });

    return () => {
      trigger.kill();
    };
  }, [stage]);

  return (
    <div>
      <button
        onClick={() => {
          goToNextPage();
        }}
        ref={ref}
      >
        {/* Load more */}
      </button>
    </div>
  );
};

export default LoadMore;
