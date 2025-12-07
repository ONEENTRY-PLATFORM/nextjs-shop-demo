import type { JSX } from 'react';

import LikeIcon from '@/components/icons/like';

// RatingBlock.tsx
const RatingBlock = (): JSX.Element => {
  return (
    <div className="flex gap-2.5">
      {/** Like counter with icon */}
      <div className="relative box-border flex shrink-0 flex-row gap-1">
        <LikeIcon />
        <div className="my-auto">0</div>
      </div>
      {/** Comment counter with icon (rotated like icon) */}
      <div className="relative box-border flex shrink-0 flex-row gap-1">
        <LikeIcon className={'rotate-180'} />
        <div className="my-auto">0</div>
      </div>
    </div>
  );
};

export default RatingBlock;
