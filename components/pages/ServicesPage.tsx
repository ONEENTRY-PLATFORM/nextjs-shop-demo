import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

const ServicesPage: FC<{ page: IPagesEntity; lang: string }> = ({
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lang,
}) => {
  const { localizeInfos } = page;
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col">
        <h1>{localizeInfos.title}</h1>
      </div>
    </div>
  );
};

export default ServicesPage;
