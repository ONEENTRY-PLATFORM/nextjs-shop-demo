'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import Loader from '@/components/shared/Loader';

const LogoutPage = () => {
  const router = useRouter();
  const { authenticate } = useContext(AuthContext);

  const onLogout = async () => {
    await logOutUser({ marker: 'email' });
    authenticate();
    router.push('/');
  };

  useEffect(() => {
    onLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex w-full">
      <Loader />
    </div>
  );
};

export default LogoutPage;
