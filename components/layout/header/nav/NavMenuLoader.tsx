import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Main NavMenu Loader
 * @param limit
 *
 * @returns JSX.Element
 */
export const NavMenuLoader: FC<LoaderProps> = ({ limit = 3 }) => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="animate-loader relative box-border flex size-6 shrink-0"
        ></div>
      ))}
    </div>
  );
};
