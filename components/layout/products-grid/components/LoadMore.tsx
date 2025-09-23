'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useCallback } from 'react';

import Spinner from '@/components/shared/Spinner';

/**
 * LoadMore
 * @param totalPages
 *
 * @returns LoadMore button
 */
const LoadMore: FC<{ totalPages: number }> = ({ totalPages }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle the .get() call in a try/catch to prevent runtime errors
  let currentPage = 1;
  try {
    currentPage = Number(searchParams?.get('page'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If accessing search params fails (e.g. during SSR), default to page 1
    currentPage = 1;
  }

  const nextPage = (currentPage < 1 ? 1 : currentPage) + 1;

  const ref = useRef(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  }, []);

  const goToNextPage = () => {
    const page = nextPage <= totalPages ? nextPage : currentPage;
    // Сохраняем текущую позицию прокрутки
    const scrollPosition = typeof window !== 'undefined' ? window.scrollY : 0;

    router.push(pathname + '?' + createQueryString('page', page.toString()), {
      scroll: false,
    });

    // Восстанавливаем позицию прокрутки после перехода
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  useGSAP(() => {
    if (nextPage > totalPages) {
      return;
    }
    console.log('trigger');

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom bottom',
      onEnter: () => {
        goToNextPage();
      },
    });

    return () => {
      trigger.kill();
    };
  }, [nextPage]);

  return (
    <button
      onClick={() => {
        goToNextPage();
      }}
      ref={ref}
      className="relative mx-auto flex h-6 w-20"
    >
      {/* {currentPage !== totalPages && 'Load more'} */}
      {currentPage < totalPages && <Spinner />}
    </button>
  );
};

export default LoadMore;
