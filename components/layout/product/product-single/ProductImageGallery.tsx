/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import '@/app/styles/image-gallery.css';
import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import FavoritesButton from '@/components/shared/FavoritesButton';
import Placeholder from '@/components/shared/Placeholder';

interface ProductImageProps {
  alt: string;
  product: IProductsEntity;
}

/**
 * Product images gallery/placeholder
 * @param product product entity object.
 * @param alt alt text for image
 *
 * @returns Product images gallery/placeholder
 */
const ProductImageGallery: FC<ProductImageProps> = ({ product, alt }) => {
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  let sliderRef1 = useRef<RefObject<Slider | null>>(null);
  let sliderRef2 = useRef<RefObject<Slider | null>>(null);
  // extract attributeValues from product
  const { attributeValues } = product;

  useEffect(() => {
    setNav1(sliderRef1 as any);
    setNav2(sliderRef2 as any);
  }, []);

  // extract images from attributeValues
  const imageSrc = attributeValues.pic.value;
  const morePic = attributeValues.more_pic.value;
  const isGallery = morePic.length > 0;
  const imagesData = isGallery
    ? [imageSrc, ...morePic].map((img) => {
        return {
          original: img?.downloadLink,
          thumbnail: img?.downloadLink,
        };
      })
    : imageSrc;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <div className="absolute right-2 top-2 z-10">
        <FavoritesButton {...product} />
      </div>
      {imagesData ? (
        isGallery ? (
          <div className="relative w-full">
            <Slider
              asNavFor={nav2}
              ref={(slide) => (sliderRef1 = slide as any)}
            >
              {imagesData.map((image: any, i: Key) => {
                return (
                  <div key={i} className="w-full items-center">
                    <Image
                      width={360}
                      height={280}
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      src={image.original}
                      alt={''}
                      className="mx-auto self-center"
                    />
                  </div>
                );
              })}
            </Slider>
            <Slider
              asNavFor={nav1}
              ref={(slide) => (sliderRef2 = slide as any)}
              slidesToShow={3}
              swipeToSlide={true}
              focusOnSelect={true}
              arrows={false}
            >
              {imagesData.map((image: any, i: Key) => {
                return (
                  <div key={i} className="w-full items-center">
                    <Image
                      width={80}
                      height={80}
                      src={image.thumbnail}
                      alt={''}
                      className="mx-auto self-center"
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <Image
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={imageSrc.downloadLink}
            alt={alt}
          />
        )
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImageGallery;
