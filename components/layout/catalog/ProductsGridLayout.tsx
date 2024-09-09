import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  gridItems: Array<IProductsEntity>;
}

const ProductsGridLayout: React.FC<GridLayoutProps> = ({ gridItems }) => {
  return (
    <div className="relative box-border flex w-full shrink-0 flex-col">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {gridItems?.map((product) => {
            if (!product.isVisible) {
              return;
            }
            return <ProductCard key={product.id} {...product} />;
          })}
        </div>
        <div className="mt-5 flex w-full justify-center">
          {/* <Pagination totalPages={totalPages} /> */}
        </div>
      </section>
    </div>
  );
};

export default ProductsGridLayout;
