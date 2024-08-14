import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import DeleteButton from './DeleteButton';
import QuantitySelector from './QuantitySelector';

interface ProductCardProps {
  product: IProductsEntity;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) {
    return;
  }
  const { id, attributeValues, price, localizeInfos } = product;
  return (
    <article className="flex w-full justify-between gap-5 border border-solid border-neutral-100 bg-white max-md:flex-wrap max-sm:flex max-sm:flex-row">
      <div className="flex justify-between gap-5">
        <div className="relative mb-auto box-border flex shrink-0 flex-row self-center">
          <input type="checkbox" checked name={'p-' + id} id="" />
        </div>
        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-300">
          <Image
            fill
            loading="lazy"
            src={attributeValues?.pic.value.downloadLink}
            alt={localizeInfos?.title}
            className="aspect-square size-full shrink-0 self-start object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{localizeInfos?.title}</h2>
          <p className="text-xl font-bold leading-8">$ {price}</p>
        </div>
      </div>
      <div className="flex gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:flex max-sm:flex-row">
        <QuantitySelector count={1} />
        <DeleteButton />
      </div>
    </article>
  );
};

export default ProductCard;
