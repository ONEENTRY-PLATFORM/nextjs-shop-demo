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
