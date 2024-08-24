import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

const ApplyButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { apply_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  return (
    <button className="whitespace-nowrap rounded-[30px] bg-orange-500 px-3.5 py-4 text-xl font-bold text-white">
      {apply_button_placeholder}
    </button>
  );
};

export default ApplyButton;
