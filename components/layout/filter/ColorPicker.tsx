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
    <div className="flex gap-1.5">
      <button
        onClick={() => {
          dispatch(setColorFilterActive(index));
        }}
        className={
          'size-6 rounded-full' + (active === index) ? 'outline-red-500' : ''
        }
        style={{
          backgroundColor: code,
        }}
      ></button>
      <span className="my-auto">{name}</span>
    </div>
  );
};

export default memo(ColorPicker);
