import Image from 'next/image';
import type { FC } from 'react';

/**
 * Empty image placeholder
 *
 * @param className wrapper className
 *
 * @returns Placeholder
 */
const Placeholder: FC<{ className?: string }> = ({ className }) => {
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

export default Placeholder;
