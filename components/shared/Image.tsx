/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable @next/next/no-img-element */
import type { JSX } from 'react';

import type { ImageProps } from '@/app/types/global';

/**
 * Custom Image component for rendering images
 * @param   {ImageProps}          props                - Image component props.
 * @param   {string}              props.src            - Source URL of the image.
 * @param   {string}              props.alt            - Alternative text for the image, defaults to empty string.
 * @param   {boolean}             props.fill           - Whether to fill the parent container.
 * @param   {number}              props.width          - Width of the image.
 * @param   {number}              props.height         - Height of the image.
 * @param   {string}              props.priority       - Whether to prioritize loading, fetchPriority priority.
 * @param   {string}              props.className      - Custom CSS class name, defaults to empty string.
 * @param   {React.CSSProperties} props.style          - Custom style object, defaults to empty object.
 * @param   {string}              props.placeholder    - Whether to show placeholder image.
 * @param   {string}              props.blurDataURL    - URL of the blurred placeholder image.
 * @param   {boolean}             props.isImageLoading - Whether the image is in loading state.
 * @param   {string}              props.loading        - Image loading strategy ("lazy" | "eager").
 * @param   {React.Ref<unknown>}  props.ref            - DOM reference.
 * @param   {() => void}          props.onLoad         - Callback function when image loading completes.
 * @returns {JSX.Element}                              Returns a JSX element containing the image.
 */
const Image = ({
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
  onLoad,
}: ImageProps): JSX.Element => {
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
        onLoad={() => onLoad()}
        fetchPriority={priority || 'auto'}
      />
    </div>
  );
};

export default Image;
