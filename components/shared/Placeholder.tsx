import Image from 'next/image';
import type { JSX } from 'react';
import { memo } from 'react';

/**
 * Empty image placeholder component that displays a logo when no image is available.
 * This component renders a placeholder container with the OneEntry logo centered,
 * typically used when an image fails to load or is not available.
 * @param   {object}      props             - Component properties
 * @param   {string}      [props.className] - Optional additional CSS classes for styling the wrapper
 * @returns {JSX.Element}                   Placeholder component with logo image
 */
const Placeholder = ({ className }: { className?: string }): JSX.Element => {
  return (
    /** Container div with background and optional custom styling */
    <div
      className={
        'relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50 ' +
        className
      }
    >
      {/** Placeholder image - OneEntry logo */}
      <Image
        fill
        sizes="(min-width: 600px) 50vw, 100vw"
        src={'/images/logo-250x70.svg'}
        alt={'OneEntry'}
        className={'mx-auto size-full max-w-[60%] ' + className}
      />
    </div>
  );
};

export default memo(Placeholder);
