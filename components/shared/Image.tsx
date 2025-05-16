/* eslint-disable @next/next/no-img-element */
import type { FC } from 'react';

interface BlurImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy' | undefined;
  placeholder?: 'blur' | 'empty' | `data:image/${string}`;
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: string;
  fetchPriority?: 'auto' | 'low' | 'high' | undefined;
  // onLoadingComplete?: OnLoadingComplete;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any;
  // decoding?: 'async' | 'sync' | 'auto';
}

const Image: FC<BlurImageProps> = ({
  src,
  alt = '',
  width,
  height,
  loading = 'lazy',
  placeholder,
  blurDataURL,
  className = '',
  style = {},
  ref,
  onClick,
  fetchPriority,
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, ...style }}
      ref={ref}
      onClick={(e) => onClick(e)}
    >
      {placeholder && (
        <img
          src={blurDataURL}
          alt=""
          fetchPriority="high"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 z-0 transition-opacity duration-700"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className="relative w-full h-full object-cover z-10 transition-opacity duration-700"
        onLoad={(e) => {
          if (placeholder) {
            e.currentTarget.previousElementSibling?.classList.add('opacity-0');
          }
        }}
        fetchPriority={fetchPriority || 'auto'}
      />
    </div>
  );
};

export default Image;
