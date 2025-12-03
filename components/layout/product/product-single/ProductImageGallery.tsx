'use client';

import '@/app/styles/image-gallery.css';
import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import { useState } from 'react';
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
  /** State for slider navigation */
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  /** Extract attributeValues from product */
  const { attributeValues } = product;

  /** Use safe utility to get product title for alt text */
  const productTitle = getProductTitle(product, 'Product image');
  const imageAlt = alt || productTitle;

  /** Extract images from attributeValues with safety checks */
  const imageSrc = attributeValues?.pic?.value;
  const morePic = attributeValues?.more_pic?.value || [];
  const isGallery = morePic.length > 1;

  /**
   * Safely construct Gallery
   * Create an array of image objects with original and thumbnail URLs
   */
  const imagesData: {
    original: string;
    thumbnail: string;
  }[] = imageSrc
    ? isGallery
      ? // If we have multiple images, create an array with the main image and additional images
        [imageSrc, ...morePic].map((img) => {
          /** Check if image exists and has the expected structure */
          if (img && typeof img === 'object' && 'downloadLink' in img) {
            return {
              original: getProductImageUrl('pic', product),
              thumbnail: getProductImageUrl('pic', product),
            };
          }
          /** Fallback to placeholder if image data is invalid */
          return {
            original: '/placeholder.jpg',
            thumbnail: '/placeholder.jpg',
          };
        })
      : // If we only have one image, create an array with just that image
        [
          {
            original: getProductImageUrl('pic', product),
            thumbnail: getProductImageUrl('pic', product),
          },
        ]
    : // If no image data, use placeholder
      [
        {
          original: '/placeholder.jpg',
          thumbnail: '/placeholder.jpg',
        },
      ];

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {/* Favorites button positioned at top right corner */}
      <div className="absolute right-2 top-2 z-10">
        <FavoritesButton {...product} />
      </div>
      {imagesData ? (
        isGallery ? (
          /* Render gallery with main image slider and thumbnail navigation */
          <div className="relative w-full">
            {/* Main image slider */}
            <Slider asNavFor={nav2 ?? undefined} ref={setNav1}>
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
            {/* Thumbnail navigation slider */}
            <Slider
              asNavFor={nav1 ?? undefined}
              ref={setNav2}
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
          /** Render single image without gallery */
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
        /** Render placeholder if no images available */
        <Placeholder />
      )}
    </div>
  );
};

export default ProductImageGallery;
