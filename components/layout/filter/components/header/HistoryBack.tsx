'use client';

import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

/**
 * History back button component that allows users to navigate to the previous page.
 * This component renders a circular button with a back arrow icon that uses the router
 * to go back in the browser history when clicked.
 * @returns {JSX.Element} Back button with arrow icon
 */
const HistoryBack = (): JSX.Element => {
  /** Get router instance for navigation */
  const router = useRouter();

  return (
    /* Button wrapper with hover effects and responsive sizing */
    <button
      type="button"
      className="group cursor-pointer flex size-12 items-center justify-center rounded-full border border-solid border-slate-200 bg-white transition-colors duration-200 hover:border-orange-500 max-sm:p-3 md:size-10 md:p-3 lg:size-12.5 lg:p-3.5"
      aria-label="Go back"
      onClick={() => router.back()}
    >
      {/** Back arrow SVG icon with hover effect */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="21"
        viewBox="0 0 26 21"
        fill="none"
        className="fill-[#4C4D56] group-hover:fill-orange-500"
      >
        <path d="M11.5271 1.19066C11.1788 0.849415 10.7065 0.657715 10.214 0.657715C9.72159 0.657715 9.2493 0.849415 8.90103 1.19066L0.543755 9.38179C0.195589 9.72313 0 10.186 0 10.6687C0 11.1514 0.195589 11.6143 0.543755 11.9556L8.90103 20.1467C9.25129 20.4783 9.72042 20.6618 10.2074 20.6576C10.6943 20.6535 11.1601 20.4621 11.5044 20.1246C11.8488 19.7871 12.0441 19.3305 12.0483 18.8533C12.0526 18.376 11.8654 17.9162 11.5271 17.5729L6.4997 12.489H24.1428C24.6354 12.489 25.1078 12.2972 25.456 11.9558C25.8043 11.6145 26 11.1515 26 10.6687C26 10.1859 25.8043 9.72296 25.456 9.38159C25.1078 9.04023 24.6354 8.84845 24.1428 8.84845H6.4997L11.5271 3.76449C11.8752 3.42315 12.0708 2.96024 12.0708 2.47758C12.0708 1.99491 11.8752 1.53201 11.5271 1.19066Z" />
      </svg>
    </button>
  );
};

export default HistoryBack;
