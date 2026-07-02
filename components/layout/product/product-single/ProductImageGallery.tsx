'use client';

import '@/app/styles/image-gallery.css';
import '@/app/styles/slick.css';
import '@/app/styles/slick-theme.css';

import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import { useState } from 'react';
import Slider from 'react-slick';

import { getProductTitle } from '@/app/api/hooks/useProductsData';
import FavoritesButton from '@/components/shared/FavoritesButton';
import Placeholder from '@/components/shared/Placeholder';

/**
 * Product images gallery/placeholder
 * @param   {object}          props             - Product image props
 * @param   {IProductsEntity} props.product     - product entity object
 * @param   {string}          props.alt         - alt text for image
 * @param   {string}          props.blurDataURL - server-resolved blur placeholder for the main image (CMS preview or generated LQIP)
 * @returns {JSX.Element}                       Product images gallery/placeholder component
 */
const ProductImageGallery = ({
  product,
  alt,
  blurDataURL,
}: {
  product: IProductsEntity;
  alt: string;
  blurDataURL?: string | undefined;
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
  const picValue = attributeValues?.pic?.value;
  /** Products normalize `pic.value` to an object, but stay defensive about the array shape */
  const mainImage = Array.isArray(picValue) ? picValue[0] : picValue;
  /** `more_pic` (groupOfImages) is an array; the attribute may be absent entirely */
  const morePic = (attributeValues?.more_pic?.value as unknown[]) || [];
  const isGallery = morePic.length > 0;

  /** Shape of a normalized image item inside `pic` / `more_pic` values */
  type GalleryImageItem = {
    downloadLink?: string;
    previewLink?: string | { default?: string[] };
  };

  /**
   * Map a raw image item to a gallery slide with its own URL and blur.
   * The main slide uses the server-resolved `blurDataURL` (CMS preview or
   * generated LQIP); additional slides fall back to their own CMS preview
   * (`previewLink.default[0]`) when the CMS has generated one.
   * @param   {unknown} img    - Raw image item from `pic` / `more_pic` value.
   * @param   {boolean} isMain - Whether this is the main (`pic`) slide.
   * @returns {object}         Slide data with original/thumbnail URLs and blur.
   */
  const toSlide = (
    img: unknown,
    isMain: boolean,
  ): { original: string; thumbnail: string; blur: string } => {
    const item = img as GalleryImageItem | null | undefined;
    if (
      item &&
      typeof item === 'object' &&
      typeof item.downloadLink === 'string'
    ) {
      const cmsBlur =
        item.previewLink && typeof item.previewLink === 'object'
          ? item.previewLink.default?.[0]
          : undefined;
      return {
        original: item.downloadLink,
        thumbnail: item.downloadLink,
        blur: (isMain ? blurDataURL : undefined) || cmsBlur || '',
      };
    }
    /** Fallback to placeholder if image data is invalid */
    return {
      original: '/placeholder.jpg',
      thumbnail: '/placeholder.jpg',
      blur: '',
    };
  };

  /**
   * Safely construct Gallery
   * Create an array of image objects with original and thumbnail URLs —
   * the main `pic` image first, followed by each `more_pic` image.
   */
  const imagesData: {
    original: string;
    thumbnail: string;
    blur: string;
  }[] = mainImage
    ? [mainImage, ...morePic].map((img, i) => toSlide(img, i === 0))
    : // If no image data, use placeholder
      [
        {
          original: '/placeholder.jpg',
          thumbnail: '/placeholder.jpg',
          blur: '',
        },
      ];

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {/* Favorites button positioned at top right corner */}
      <div className="absolute top-2 right-2 z-10">
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
                      style={{ width: 'auto', height: 'auto' }}
                      className="mx-auto self-center"
                      /** `placeholder="blur"` requires a non-empty blurDataURL */
                      {...(image.blur && {
                        placeholder: 'blur' as const,
                        blurDataURL: image.blur,
                      })}
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
                  <div key={i} className="w-full cursor-pointer items-center">
                    <Image
                      width={80}
                      height={80}
                      src={image.thumbnail}
                      alt={imageAlt}
                      style={{ width: 'auto', height: 'auto' }}
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
              sizes="(min-width: 1024px) 66vw, 100vw"
              style={{ width: 'auto', height: 'auto' }}
              className="mx-auto self-center"
              /** `placeholder="blur"` requires a non-empty blurDataURL */
              {...(imagesData[0]?.blur && {
                placeholder: 'blur' as const,
                blurDataURL: imagesData[0].blur,
              })}
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
