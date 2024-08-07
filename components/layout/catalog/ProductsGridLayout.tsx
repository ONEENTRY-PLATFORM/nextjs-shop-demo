import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductCard from '../product/product-card';

interface GridLayoutProps {
  gridItems: Array<IProductsEntity>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductsGridLayout: React.FC<GridLayoutProps> = ({ gridItems }) => {
  return (
    <div className="relative box-border flex w-screen shrink-0 flex-col px-5 py-4">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {gridItems?.map((product) => {
            if (!product.isVisible) {
              return;
            }
            return <ProductCard key={product.id} {...product} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default ProductsGridLayout;
