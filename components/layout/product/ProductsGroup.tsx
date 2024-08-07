import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import GroupCard from './group-card/GroupCard';

interface ProductsGroupProps {
  title: string;
  productsGroup: Array<IProductsEntity>;
}

const ProductsGroup: React.FC<ProductsGroupProps> = ({
  title,
  productsGroup,
}) => {
  return (
    <section className="mb-8 flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex flex-row justify-between gap-2.5 max-md:max-w-full">
        {productsGroup.map((product) => (
          <div
            key={product.id}
            className="relative box-border flex w-[32.5%] shrink-0 flex-col max-md:w-full"
          >
            <GroupCard
              title={product.localizeInfos.title}
              currentPrice={product.price}
              originalPrice={product.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
