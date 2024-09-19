import type { FC } from 'react';
import { useContext } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const ApplyButton: FC = () => {
  const { setOpen } = useContext(OpenDrawerContext);
  const { apply_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  return (
    <button onClick={() => setOpen(false)} className="btn btn-xl btn-primary">
      {apply_button_placeholder}
    </button>
  );
};

export default ApplyButton;
