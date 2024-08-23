import React, { memo } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { setColorFilterActive } from '@/app/store/reducers/FilterSlice';

interface Props {
  code: string;
  name: string;
  active?: number;
  key: number;
  index: number;
}

const ColorPicker: React.FC<Props> = ({ code, name, active, index }) => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        dispatch(setColorFilterActive(index));
      }}
    >
      <p>{name}</p>
    </button>
  );
};

export default memo(ColorPicker);
