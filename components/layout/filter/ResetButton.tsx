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
      className="whitespace-nowrap rounded-[30px] border border-solid border-orange-500 px-16 py-4 text-xl font-bold text-orange-500"
    >
      {reset_button_placeholder}
    </button>
  );
};

export default ResetButton;
