/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import type React, { ReactNode } from 'react';

/**
 * Localize info.
 * @property {string} content   - Content of the page.
 * @property {string} menuTitle - Menu title of the page.
 * @property {string} title     - Title of the page.
 */
declare type LocalizeInfo = {
  content: string;
  menuTitle: string;
  title: string;
};

/**
 * Page props.
 * @property {object} params       - Page parameters.
 * @property {object} searchParams - Search parameters.
 */
declare type PageProps = {
  params: Promise<{ page?: any; handle: string; lang: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  }>;
};

/**
 * Simple page props.
 * @property {IPagesEntity} page  - Page object.
 * @property {string}       lang  - Language code.
 * @property {object}       dict  - Dictionary object.
 * @property {object}       [key] - Additional key-value pair.
 */
declare type SimplePageProps = {
  page?: IPagesEntity;
  lang?: string;
  dict?: IAttributeValues;
  [key as string]: any;
};

/**
 * Loader props.
 * @property {object} data     - Data object.
 * @property {number} [limit]  - Limit of items.
 * @property {number} [offset] - Offset of items.
 */
declare type LoaderProps = {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
};

/**
 * Metadata params.
 * @property {object} params - Page parameters.
 */
declare type MetadataParams = {
  params: Promise<{ handle: string; lang: string }>;
};

/**
 * Cart state.
 * @property {number}      quantity     - Quantity of items in cart.
 * @property {number}      id           - ID of the cart.
 * @property {IProducts[]} productsData - Array of products data.
 */
export type CartState = {
  quantity: number;
  id: number;
  productsData: IProducts[];
};

/**
 * Animations props.
 * @property {ReactNode} children  - Children of the component.
 * @property {string}    className - Class name of the component.
 * @property {number}    index     - Index of the component.
 */
export type AnimationsProps = {
  children: ReactNode;
  className: string;
  index: number;
};

/**
 * Product data.
 * @property {number}  id       - ID of the product.
 * @property {boolean} selected - Whether the product is selected.
 * @property {number}  quantity - Quantity of the product.
 */
export type IProducts = {
  id: number;
  selected: boolean;
  quantity: number;
};

/**
 * Product metadata.
 * @property {string} title       - Title of the product.
 * @property {string} description - Description of the product.
 * @property {string} url         - URL of the product.
 * @property {number} width       - Width of the product image.
 * @property {number} height      - Height of the product image.
 * @property {string} alt         - Alt text of the product image.
 */
interface IProductMetadata {
  title: string;
  description: string;
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Page metadata.
 * @property {string}           title           - Title of the page.
 * @property {string}           description     - Description of the page.
 * @property {boolean}          isVisible       - Whether the page is visible.
 * @property {IAttributeValues} attributeValues - Attribute values of the page.
 * @property {LocalizeInfo}     localizeInfos   - Localize info of the page.
 */
interface IPageMetadata {
  title: string;
  description: string;
  isVisible: boolean;
  attributeValues: {
    icon?: {
      downloadLink: string;
    };
  };
  localizeInfos: {
    title: string;
    plainContent: string;
  };
}

/**
 * Order product.
 * @property {number}        id           - ID of the product.
 * @property {number}        quantity     - Quantity of the product.
 * @property {string}        title        - Title of the product.
 * @property {string | null} sku          - SKU of the product.
 * @property {string | null} previewImage - Preview image of the product.
 * @property {number}        price        - Price of the product.
 */
export type IOrderProducts = {
  id: number;
  quantity: number;
  title: string;
  sku: string | null;
  previewImage: string | null;
  price: number;
};

/**
 * Image props.
 * @property {string}                                              src              - Source of the image.
 * @property {string}                                              alt              - Alt text of the image.
 * @property {boolean}                                             fill             - Whether the image should fill the available space.
 * @property {number}                                              [width]          - Width of the image.
 * @property {number}                                              [height]         - Height of the image.
 * @property {boolean}                                             [isImageLoading] - Whether the image is loading.
 * @property {string}                                              [className]      - Class name of the image.
 * @property {React.CSSProperties}                                 [style]          - Style of the image.
 * @property {string}                                              [objectFit]      - Object fit of the image.
 * @property {string}                                              [priority]       - Priority of the image.
 * @property {(result?: unknown) => void}                          [onLoad]         - Callback function when the image loading is complete.
 * @property {React.Ref<unknown>}                                  ref              - Reference of the image.
 * @property {(event: React.MouseEvent<HTMLImageElement>) => void} [onClick]        - Callback function when the image is clicked.
 */
export type ImageProps = {
  src: string;
  alt?: string;
  fill: boolean;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy' | undefined;
  placeholder?: 'blur' | 'empty' | `data:image/${string}`;
  blurDataURL?: string;
  isImageLoading: boolean;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: string;
  priority?: 'auto' | 'low' | 'high' | undefined;
  onLoad?: any;
  ref: React.Ref<any>;
  onClick?: any;
  // decoding?: 'async' | 'sync' | 'auto';
};

export type FormProps = { lang: string; dict: IAttributeValues };

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (
          siteKey: string,
          options: { action: string },
        ) => Promise<string>;
      };
    };
  }
}
