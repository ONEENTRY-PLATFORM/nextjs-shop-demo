/* eslint-disable @next/next/no-img-element */
import type { FC } from 'react';

import type { ImageProps } from '@/app/types/global';

const Image: FC<ImageProps> = ({
  src,
  alt = '',
  fill,
  width,
  height,
  priority,
  className = '',
  style = {},
  placeholder,
  blurDataURL,
  isImageLoading,
  loading,
  ref,
  onLoadingComplete,
}) => {
  return (
    <div
      className={`relative overflow-hidden ${fill ? 'size-full' : ''} ${className}`}
      style={{ width, height, ...style }}
      ref={ref}
    >
      {placeholder && (
        <img
          src={blurDataURL}
          alt={alt}
          fetchPriority="high"
          aria-hidden="true"
          className={
            'absolute inset-0 z-0 size-full scale-110 object-cover blur-xl transition-opacity duration-300 ' +
            isImageLoading
              ? 'hidden'
              : ''
          }
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={
          'relative z-10 size-full object-cover transition-opacity duration-300 '
        }
        onLoad={() => onLoadingComplete()}
        fetchPriority={priority || 'auto'}
      />
    </div>
  );
};

export default Image;
