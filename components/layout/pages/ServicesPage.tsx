import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

const ServicesPage: FC<{ page: IPagesEntity }> = ({ page }) => {
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
