/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import type { JSX } from 'react';

import { getImageUrl } from '@/app/api/hooks/useAttributesData';
import { getProductTitle } from '@/app/api/hooks/useProductsData';
import Placeholder from '@/components/shared/Placeholder';

// ModalHeading
const ModalHeading = ({ product }: { product: any }): JSX.Element => {
  /** Get product data */
  const productImageUrl = getImageUrl('pic', product.attributeValues);
  const productTitle = getProductTitle(product);

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-16 items-center justify-center overflow-hidden">
        {productImageUrl ? (
          <Image
            src={productImageUrl}
            alt={productTitle}
            width={64}
            height={64}
            className="size-full object-cover"
          />
        ) : (
          <Placeholder />
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold text-neutral-800">{productTitle}</h2>
      </div>
    </div>
  );
};

export default ModalHeading;
