import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

const ApplyButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { apply_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  return (
    <button className="px-3.5 py-4 text-xl font-bold text-white whitespace-nowrap bg-orange-500 rounded-[30px]">
      {apply_button_placeholder}
    </button>
  );
};

export default ApplyButton;
