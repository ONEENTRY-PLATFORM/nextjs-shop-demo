import type { JSX } from 'react';

import LikeIcon from '@/components/icons/like';

/**
 * LikesBlock
 * @returns {JSX.Element} LikesBlock component.
 */
const LikesBlock = (): JSX.Element => {
  return (
    <div className="flex gap-2.5 text-sm leading-5 text-slate-300">
      {/** Like counter with icon */}
      <div className="relative box-border flex shrink-0 flex-row gap-1 group">
        <LikeIcon />
        <div className="my-auto">0</div>
      </div>
      {/** Dislike counter with icon */}
      <div className="relative box-border flex shrink-0 flex-row gap-1 group">
        <LikeIcon className={'rotate-180'} />
        <div className="my-auto">0</div>
      </div>
    </div>
  );
};

export default LikesBlock;
