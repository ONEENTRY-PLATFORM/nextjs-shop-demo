import { useRouter } from 'next/navigation';
import type { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loader from '@/components/shared/Loader';

type EditOrderButtonProps = {
  isLoading: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditOrderButton: FC<EditOrderButtonProps> = ({ isLoading }) => {
  const router = useRouter();
  const onEditOrder = async () => {
    router.push('/cart');
  };

  return (
    <button
      onClick={() => onEditOrder()}
      className="btn btn-o btn-sm btn-o-primary mt-5 px-12 max-md:w-full"
    >
      Edit order
    </button>
  );
};

export default EditOrderButton;
