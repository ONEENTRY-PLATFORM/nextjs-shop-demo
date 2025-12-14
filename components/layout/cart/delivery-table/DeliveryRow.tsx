import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { UsePrice } from '@/components/utils/utils';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Delivery form row component that displays delivery option information
 * Shows delivery icon, title, and price with formatted currency
 * @param   {object}          props          - DeliveryRow props
 * @param   {string}          props.lang     - Current language shortcode for price formatting
 * @param   {IProductsEntity} props.delivery - Represents a product entity object containing delivery information
 * @returns {JSX.Element}                    Delivery row with icon, title and price
 */
const DeliveryRow = ({
  lang,
  delivery,
}: {
  lang: string;
  delivery: IProductsEntity;
}): JSX.Element => {
  return (
    /** Wrap delivery row with animation component for staggered entrance effects */
    <TableRowAnimations
      className="tr h-25 border-b border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={10}
    >
      {/** Delivery icon cell */}
      <div className="td w-3/12 align-middle">
        <Image
          loading="lazy"
          src="/icons/delivery.svg"
          alt="delivery"
          width={125}
          height={107}
          className="aspect-[1.16] w-31.25 max-w-full shrink-0 p-4 max-sm:p-2"
        />
      </div>

      {/** Delivery information cell with title and price */}
      <div className="td w-8/12 px-5 align-middle">
        <div className="mt-2 flex flex-col self-start">
          {/** Delivery title from localized information */}
          <div className="mb-4 text-base max-sm:mb-2">
            {delivery?.localizeInfos?.title}
          </div>

          {/** Delivery price formatted according to current language */}
          <div className="mb-2 text-xl font-bold leading-8">
            {UsePrice({
              amount: delivery?.price || 0,
              lang,
            })}
          </div>
        </div>
      </div>

      {/** Empty cell for layout spacing */}
      <div className="td w-1/12 pl-5 align-middle" />
    </TableRowAnimations>
  );
};

export default DeliveryRow;
