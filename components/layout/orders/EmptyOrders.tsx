import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyOrders = () => {
  const [emptyText, setEmptyText] = useState('');
  const [goShopText, setGoShopText] = useState('');

  const { empty_cart_plug, go_to_shop } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  useEffect(() => {
    if (empty_cart_plug) {
      setEmptyText(empty_cart_plug.value);
    }
  }, [empty_cart_plug]);

  useEffect(() => {
    if (go_to_shop) {
      setGoShopText(go_to_shop.value);
    }
  }, [go_to_shop]);

  return (
    <div className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800">
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        {/* Empty orders */}
        {emptyText}
      </h1>
      <Link href="/shop" className="btn btn-sm btn-o btn-o-primary">
        {goShopText}
      </Link>
    </div>
  );
};

export default EmptyOrders;
