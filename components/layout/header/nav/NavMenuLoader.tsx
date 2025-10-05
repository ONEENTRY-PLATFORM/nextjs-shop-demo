import type { FC, JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Main NavMenu Loader.
 * @param   {LoaderProps} props       - Component props.
 * @param   {number}      props.limit - Number of menu items to load.
 * @returns {JSX.Element}             JSX.Element.
 */
export const NavMenuLoader: FC<LoaderProps> = ({
  limit = 3,
}: LoaderProps): JSX.Element => {
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
