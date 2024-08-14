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

  return 'tset';
};

export default CatalogFiltersModal;
