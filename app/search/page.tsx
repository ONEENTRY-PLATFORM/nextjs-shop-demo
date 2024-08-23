import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

export default async function SearchPage() {
  // const products = await getPages('en_US');
  const products = [];

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense
          fallback={
            <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
          }
        >
          <ProductsGridLayout
            gridItems={products.filter(
              (product: IProductsEntity) =>
                product.attributeValues.stickers?.value.value === 'best' &&
                product.attributeSetIdentifier !== 'service_product',
            )}
          />
        </Suspense>
      </div>
    </section>
  );
}
