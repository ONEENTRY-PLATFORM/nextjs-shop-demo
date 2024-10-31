import Image from 'next/image';
import type { FC } from 'react';

import { UsePrice } from '@/components/utils';

import TableRowAnimations from '../animations/TableRowAnimations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeliveryRow: FC<{ lang: string; delivery: any }> = ({
  lang,
  delivery,
}) => {
  return (
    <TableRowAnimations
      className="tr h-[100px] border-b border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={10}
    >
      <div className="td w-3/12 align-middle">
        <Image
          loading="lazy"
          src="/icons/delivery.svg"
          alt="delivery"
          width={125}
          height={107}
          className="aspect-[1.16] w-[125px] max-w-full shrink-0 p-4 max-sm:p-2"
        />
      </div>
      <div className="td w-8/12 px-5 align-middle">
        <div className="mt-2 flex flex-col self-start">
          <div className="mb-4 text-base max-sm:mb-2">
            {delivery?.localizeInfos?.title}
          </div>
          <div className="mb-2 text-xl font-bold leading-8">
            {UsePrice({
              amount: delivery?.price,
              lang,
            })}
          </div>
        </div>
      </div>
      <div className="td w-1/12 pl-5 align-middle" />
    </TableRowAnimations>
  );
};

export default DeliveryRow;
