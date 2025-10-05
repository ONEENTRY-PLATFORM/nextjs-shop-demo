import Image from 'next/image';
import type { JSX } from 'react';
import { memo } from 'react';

/**
 * Empty image placeholder.
 * @param   {object}      props             - Placeholder props.
 * @param   {string}      [props.className] - wrapper className.
 * @returns {JSX.Element}                   JSX.Element - Placeholder.
 */
const Placeholder = ({ className }: { className?: string }): JSX.Element => {
  return (
    <div
      className={
        'relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50 ' +
        className
      }
    >
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
