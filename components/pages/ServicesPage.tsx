import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

/**
 * Services page
 * @param page
 *
 * @returns Services page
 */
const ServicesPage: FC<SimplePageProps> = ({ page }) => {
  if (!page) {
    return;
  }

  // Extract content from page localizeInfos
  const {
    localizeInfos: { title },
  } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col">
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default ServicesPage;
