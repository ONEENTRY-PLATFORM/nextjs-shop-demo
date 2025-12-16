/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import type { JSX } from 'react';

import {
  getProductImageUrl,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';
import Placeholder from '@/components/shared/Placeholder';

// Heading.tsx
const ModalHeading = ({ product }: { product: any }): JSX.Element => {
  /** Get product data */
  const productImageUrl = getProductImageUrl('pic', product);
  const productTitle = getProductTitle(product);

  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 flex items-center justify-center overflow-hidden">
        {productImageUrl ? (
          <Image
            src={productImageUrl}
            alt={productTitle}
            width={64}
            height={64}
            className="h-full w-full object-cover"
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
