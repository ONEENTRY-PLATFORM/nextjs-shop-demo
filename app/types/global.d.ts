/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

declare type LocalizeInfo = {
  content: string;
  menuTitle: string;
  title: string;
};

declare type PageProps = {
  params: Promise<{ page?: any; handle: string; lang: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  }>;
};

declare type SimplePageProps = {
  page?: IPagesEntity;
  lang?: string;
  dict?: IAttributeValues;
  [key as string]: any;
};

declare type LoaderProps = {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
};

declare type MetadataParams = {
  params: Promise<{ handle: string; lang: string }>;
};

export type CartState = {
  quantity: number;
  id: number;
  productsData: IProducts[];
};

export type AnimationsProps = {
  children: ReactNode;
  className: string;
  index: number;
};

export type IProducts = {
  id: number;
  selected: boolean;
  quantity: number;
};
interface IProductMetadata {
  title: string;
  description: string;
  url: string;
  width: number;
  height: number;
  alt: string;
}

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

export type IOrderProducts = {
  id: number;
  quantity: number;
  title: string;
  sku: string | null;
  previewImage: any;
  price: number;
};

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
  onLoadingComplete?: any;
  ref: any;
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
