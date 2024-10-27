import Image from 'next/image';
import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';

const EmptyCart = ({
  lang,
  dict,
}: {
  lang: string;
  dict: IAttributeValues;
}) => {
  const { empty_cart_plug, go_to_shop } = dict;

  return (
    <div className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800">
      <Image
        width={100}
        height={100}
        src={'/icons/cart.svg'}
        alt={empty_cart_plug?.value}
        className="mb-5 size-20 opacity-20"
      />
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        {empty_cart_plug?.value}
      </h1>
      <Link
        href={'/' + lang + '/shop/'}
        className="btn btn-sm btn-o btn-o-primary"
      >
        {go_to_shop?.value}
      </Link>
    </div>
  );
};

export default EmptyCart;
