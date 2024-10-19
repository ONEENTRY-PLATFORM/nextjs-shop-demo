'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useCallback } from 'react';

const LoadMore: FC<{ totalPages: number }> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;
  const nextPage = (currentPage < 1 ? 1 : currentPage) + 1;

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
    router.push(
      pathname +
        '?' +
        createQueryString(
          'page',
          (nextPage <= totalPages ? nextPage : currentPage).toString(),
        ),
      { scroll: false },
    );
  };

  useGSAP(() => {
    if (nextPage >= totalPages) {
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom bottom',
      onEnter: () => {
        goToNextPage();
      },
      markers: {
        startColor: 'black',
        endColor: 'black',
        fontSize: '14px',
        indent: 20,
      },
    });

    return () => {
      trigger.kill();
    };
  }, [currentPage]);

  return (
    <div>
      <button
        onClick={() => {
          // goToNextPage();
        }}
        ref={ref}
      >
        {/* {currentPage === totalPages ? '' : 'Load more'} */}
      </button>
    </div>
  );
};

export default LoadMore;
