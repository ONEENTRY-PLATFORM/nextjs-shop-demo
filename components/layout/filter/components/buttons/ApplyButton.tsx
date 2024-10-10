import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ApplyButton: FC<{ dict: any }> = ({ dict }) => {
  const { setOpen } = useContext(OpenDrawerContext);
  const { apply_button_placeholder } = dict;

  return (
    <button onClick={() => setOpen(false)} className="btn btn-xl btn-primary">
      {apply_button_placeholder.value}
    </button>
  );
};

export default ApplyButton;
