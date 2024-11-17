'use client';

import '@/app/styles/image-gallery.css';

import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';

import Placeholder from '@/components/shared/Placeholder';

import FavoritesButton from '../../../shared/FavoritesButton';

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
  const ref = useRef(null);
  const [state, setState] = useState(false);

  // extract attributeValues from product
  const { attributeValues } = product;

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
          <ImageGallery
            ref={ref}
            items={imagesData}
            showPlayButton={false}
            showFullscreenButton={false}
            autoPlay={true}
            stopPropagation={true}
            onClick={() => {
              if (!ref.current) {
                return;
              }
              if (!state) {
                (ref.current as ImageGallery).fullScreen();
                setState(true);
              } else if (state) {
                (ref.current as ImageGallery).exitFullScreen();
                setState(false);
              }
            }}
          />
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
