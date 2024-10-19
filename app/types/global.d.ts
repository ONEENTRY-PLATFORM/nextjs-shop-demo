import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare type LocalizeInfo = {
  content: string;
  menuTitle: string;
  title: string;
};

declare type PageProps = {
  params: { page: any; handle: string; lang: string };
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
};

declare type SimplePageProps = {
  page: IPagesEntity;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
};

declare type LoaderProps = {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
};

declare type MetadataParams = {
  params: { handle: string; lang: string };
};
