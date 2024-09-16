import type { FC } from 'react';

import ApplyButton from './ApplyButton';
import ResetButton from './ResetButton';

const FilterButtons: FC = () => {
  return (
    <div className="relative box-border flex shrink-0 flex-col gap-4">
      <ResetButton />
      <ApplyButton />
    </div>
  );
};

export default FilterButtons;
