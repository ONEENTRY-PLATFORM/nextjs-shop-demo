import type { FC } from 'react';

/**
 * Spinner
 *
 * @returns Animated Spinner
 */
const Spinner: FC = () => {
  return (
    <div className="absolute aspect-square size-full translate-x-[calc(50%_-_12px)] translate-y-[calc(50%_-_12px)] overflow-hidden">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <g>
          <circle cx="12" cy="2.5" r="1.5" opacity=".14" />
          <circle cx="16.75" cy="3.77" r="1.5" opacity=".29" />
          <circle cx="20.23" cy="7.25" r="1.5" opacity=".43" />
          <circle cx="21.50" cy="12.00" r="1.5" opacity=".57" />
          <circle cx="20.23" cy="16.75" r="1.5" opacity=".71" />
          <circle cx="16.75" cy="20.23" r="1.5" opacity=".86" />
          <circle cx="12" cy="21.5" r="1.5" />
        </g>
      </svg>
    </div>
  );
};

export default Spinner;
