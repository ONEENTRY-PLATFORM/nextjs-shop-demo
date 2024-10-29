/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC, useEffect, useState } from 'react';

import { getProductById } from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import {
  deselectProduct,
  setCartProducts,
} from '@/app/store/reducers/CartSlice';
import type { IProducts } from '@/app/types/global';
import Placeholder from '@/components/shared/Placeholder';

import ProductAnimations from '../animations/ProductAnimations';
import PriceDisplay from './PriceDisplay';

const ProductCard: FC<{
  productData: IProducts;
  selected: boolean;
  lang: string;
  index: number;
  total: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTotal: any;
}> = ({ productData, selected, lang, index }) => {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<IProductsEntity>();

  async function getProduct() {
    const { product } = await getProductById(productData.id, lang);
    return product;
  }

  useEffect(() => {
    getProduct().then((res) => {
      if (res !== undefined) {
        setProduct(res as IProductsEntity);
      }
    });
  }, []);

  useEffect(() => {
    if (product) {
      dispatch(setCartProducts(product));
    }
  }, [product]);

  if (!product) {
    return;
  }

  const { id, attributeValues, localizeInfos } = product;
  const imgSrc = attributeValues.pic?.value.downloadLink;
  const title = localizeInfos?.title;

  return (
    <ProductAnimations
      className="product-in-cart"
      product={product}
      index={index}
    >
      <div className="relative flex justify-between gap-5">
        <div className="relative z-10 mb-auto box-border flex shrink-0 flex-row self-center overflow-hidden rounded-md">
          <input
            onChange={() => {
              dispatch(deselectProduct(id));
            }}
            type="checkbox"
            name={'deselectProduct-' + id}
            id={'deselectProduct-' + id}
            checked={selected}
            className="size-5 border-spacing-3 accent-orange-500 ring-2 ring-orange-700"
          />
        </div>

        <div className="relative h-[150px] w-[130px] shrink-0 rounded-xl bg-slate-50">
          {imgSrc ? (
            <Image
              width={130}
              height={150}
              loading="lazy"
              src={imgSrc}
              alt={title}
              className="size-full shrink-0 self-start object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>

        <div className="flex flex-col gap-5 self-start text-neutral-600">
          <h2 className="text-base leading-8">{title}</h2>
          <PriceDisplay
            currentPrice={attributeValues.sale?.value}
            originalPrice={attributeValues.price?.value}
            lang={lang}
          />
        </div>

        <Link
          href={`/shop/product/` + id}
          className="absolute left-0 top-0 z-0 flex size-full"
        ></Link>
      </div>
    </ProductAnimations>
  );
};

export default ProductCard;
