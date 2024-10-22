import { useTransitionRouter } from 'next-transition-router';
import type { FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import Loader from '@/components/shared/Loader';

type EditOrderButtonProps = {
  isLoading: boolean;
};

const EditOrderButton: FC<EditOrderButtonProps> = ({ isLoading }) => {
  const router = useTransitionRouter();
  const { edit_order_text } = useAppSelector(
    (state) => state.systemContentReducer.content,
  ) as {
    edit_order_text: {
      value: string;
    };
  };
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
