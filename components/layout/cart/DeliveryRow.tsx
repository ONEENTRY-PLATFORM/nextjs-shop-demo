/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface DeliveryRowProps {
  imageSrc: string;
  deliveryText: string;
  deliveryPrice: string;
}

const DeliveryRow: React.FC<DeliveryRowProps> = ({
  imageSrc,
  deliveryText,
  deliveryPrice,
}) => (
  <tr className="table-row h-[50px] gap-5 border border-solid border-[black] max-md:max-w-full max-md:flex-wrap">
    <td className="table-cell align-middle">
      <img
        loading="lazy"
        src={imageSrc}
        alt=""
        className="aspect-[1.16] w-[125px] max-w-full shrink-0"
      />
    </td>
    <td className="table-cell px-5 align-middle">
      <div className="mt-2 flex flex-col self-start">
        <div className="text-base">{deliveryText}</div>
        <div className="mt-4 text-xl font-bold leading-8">{deliveryPrice}</div>
      </div>
    </td>
    <td className="table-cell pl-5 align-middle" />
  </tr>
);

export default DeliveryRow;
