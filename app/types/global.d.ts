import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

declare type LocalizeInfo = {
  content: string;
  menuTitle: string;
  title: string;
};

declare type PageProps = {
  params: { page: string; handle: string; lang: string };
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
};

declare type SimplePageProps = {
  page?: IPagesEntity;
  lang: string;
  dict: IAttributeValues;
};

declare type LoaderProps = {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
};

declare type MetadataParams = {
  params: { handle: string; lang: string };
};

export type CartState = {
  quantity: number;
  id: number;
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

export type FormProps = { lang: string; dict: IAttributeValues };
