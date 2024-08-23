import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeAllFilters } from '@/app/store/reducers/FilterSlice';

const ResetButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reset_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  const onReset = () => {
    dispatch(removeAllFilters());
  };

  return (
    <button
      onClick={onReset}
      className="px-16 py-4 text-xl font-bold text-orange-500 whitespace-nowrap border border-orange-500 border-solid rounded-[30px]"
    >
      {reset_button_placeholder}
    </button>
  );
};

export default ResetButton;
