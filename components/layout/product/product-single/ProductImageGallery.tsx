/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import '@/app/styles/image-gallery.css';
import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import {
  getProductImageUrl,
  getProductTitle,
} from '@/app/api/hooks/useProductsData';
import FavoritesButton from '@/components/shared/FavoritesButton';
import Placeholder from '@/components/shared/Placeholder';

/**
 * Product images gallery/placeholder
 * @param   {object}          props         - Product image props
 * @param   {IProductsEntity} props.product - product entity object
 * @param   {string}          props.alt     - alt text for image
 * @returns {JSX.Element}                   Product images gallery/placeholder component
 */
const ProductImageGallery = ({
  product,
  alt,
}: {
  product: IProductsEntity;
  alt: string;
}): JSX.Element => {
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  let sliderRef1 = useRef<RefObject<Slider | null>>(null);
  let sliderRef2 = useRef<RefObject<Slider | null>>(null);

  // Extract attributeValues from product
  const { attributeValues } = product;

  // Use safe utility to get product title for alt text
  const productTitle = getProductTitle(product, 'Product image');
  const imageAlt = alt || productTitle;

  useEffect(() => {
    setNav1(sliderRef1 as any);
    setNav2(sliderRef2 as any);
  }, []);

  // Extract images from attributeValues with safety checks
  const imageSrc = attributeValues?.pic?.value;
  const morePic = attributeValues?.more_pic?.value || [];
  const isGallery = morePic.length > 0;

  // Safely construct Gallery
  const imagesData: {
    original: string;
    thumbnail: string;
  }[] = imageSrc
    ? isGallery
      ? [imageSrc, ...morePic].map((img) => {
          if (img && typeof img === 'object' && 'downloadLink' in img) {
            return {
              original: getProductImageUrl('pic', product),
              thumbnail: getProductImageUrl('pic', product),
            };
          }
          return {
            original: '/placeholder.jpg',
            thumbnail: '/placeholder.jpg',
          };
        })
      : [
          {
            original: getProductImageUrl('pic', product),
            thumbnail: getProductImageUrl('pic', product),
          },
        ]
    : [
        {
          original: '/placeholder.jpg',
          thumbnail: '/placeholder.jpg',
        },
      ];

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
              {imagesData.map((image, i: Key) => {
                return (
                  <div key={i} className="w-full items-center">
                    <Image
                      width={360}
                      height={280}
                      src={image.original}
                      alt={imageAlt}
                      sizes="(min-width: 1024px) 66vw, 100vw"
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
              {imagesData.map((image, i: Key) => {
                return (
                  <div key={i} className="w-full items-center cursor-pointer">
                    <Image
                      width={80}
                      height={80}
                      src={image.thumbnail}
                      alt={imageAlt}
                      className="mx-auto self-center"
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div className="relative w-full">
            <Image
              width={360}
              height={280}
              src={imagesData[0]?.original || '/placeholder.jpg'}
              alt={imageAlt}
              className="mx-auto self-center"
            />
          </div>
        )
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImageGallery;
