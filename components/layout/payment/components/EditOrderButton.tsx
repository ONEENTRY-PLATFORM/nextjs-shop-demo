import { useTransitionRouter } from 'next-transition-router';
import type { FC } from 'react';

import Loader from '@/components/shared/Loader';

type EditOrderButtonProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  isLoading: boolean;
};

/**
 * Edit order button
 * @param isLoading loading state
 *
 * @returns JSX.Element
 */
const EditOrderButton: FC<EditOrderButtonProps> = ({ dict, isLoading }) => {
  const router = useTransitionRouter();
  const { edit_order_text } = dict;

  /**
   * Edit order button click
   * @async
   */
  const onEditOrder = async () => {
    router.push('/cart');
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onEditOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      {isLoading && <Loader />}
      {edit_order_text.value}
    </button>
  );
};

export default EditOrderButton;
