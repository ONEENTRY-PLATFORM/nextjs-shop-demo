import type { Dispatch } from 'react';
import type React from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { removeAllFilters } from '../../../app/store/reducers/FilterSlice';

interface Props {
  visible: boolean;
  setVisible: Dispatch<boolean>;
  children?: React.ReactNode;
  text?: string;
}

const CatalogFiltersModal: React.FC<Props> = ({ visible, setVisible }) => {
  const dispatch = useAppDispatch();

  const onReset = () => {
    dispatch(removeAllFilters());
  };

  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="max-w-full text-xl font-bold text-neutral-600">
          SearchFilterForm
        </h2>
      </div>
    </form>
  );
};

export default CatalogFiltersModal;
