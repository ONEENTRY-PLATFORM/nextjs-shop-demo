import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';

const EmptyOrders = ({ lang }: { lang: string }) => {
  const [emptyText, setEmptyText] = useState<string>('');
  const [goShopText, setGoShopText] = useState<string>('');

  const { empty_cart_plug, go_to_shop } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  useEffect(() => {
    if (empty_cart_plug) {
      setEmptyText(empty_cart_plug.value);
    }
    if (go_to_shop) {
      setGoShopText(go_to_shop.value);
    }
  }, [go_to_shop, empty_cart_plug]);

  return (
    <div className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800">
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        {emptyText}
      </h1>
      <Link href={'/shop/' + lang} className="btn btn-sm btn-o btn-o-primary">
        {goShopText}
      </Link>
    </div>
  );
};

export default EmptyOrders;
