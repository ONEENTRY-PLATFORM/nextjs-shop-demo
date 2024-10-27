import type { IAttributeValues } from 'oneentry/dist/base/utils';

import { useGetProduct } from '@/app/api';

import ProductCard from '../products-grid/components/product-card/ProductCard';

const FavoriteCard = ({
  lang,
  dict,
  favoriteId,
  index,
}: {
  lang: string;
  dict: IAttributeValues;
  favoriteId: number;
  index: number;
}) => {
  const { product } = useGetProduct({ id: favoriteId });

  if (!product) {
    return;
  }
  return (
    <ProductCard
      key={index}
      product={product}
      index={index}
      lang={lang}
      dict={dict}
    />
  );
};

export default FavoriteCard;
