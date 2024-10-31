import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

const ServicesPage: FC<SimplePageProps> = ({ page }) => {
  if (!page) {
    return;
  }
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
