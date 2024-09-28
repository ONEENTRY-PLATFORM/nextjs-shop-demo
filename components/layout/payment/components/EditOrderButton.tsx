import { useRouter } from 'next/navigation';
import type { FC } from 'react';

import Loader from '@/components/shared/Loader';

type EditOrderButtonProps = {
  isLoading: boolean;
};

const EditOrderButton: FC<EditOrderButtonProps> = ({ isLoading }) => {
  const router = useRouter();
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
      Edit order
    </button>
  );
};

export default EditOrderButton;
