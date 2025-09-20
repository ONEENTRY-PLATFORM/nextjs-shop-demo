// import parse from 'html-react-parser';
import Image from 'next/image';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

import SlideUpTransition from '@/app/animations/SlideUpTransition';

import { useImageUrl, useString, useText } from '../hooks/useAttributes';

/**
 * About page
 * @param page Represents a page entity object.
 *
 * @returns About page
 */
const AboutPage: FC<{ page: IPagesEntity }> = ({ page }) => {
  // Safely extract content from page using utility functions
  const attributeValues = page.attributeValues;
  const pageTitle = useString('title', attributeValues);
  const imageSrc = useImageUrl('img', attributeValues) || '';
  // const title = useString('title', attributeValues);
  const contentData = useText('content', attributeValues, 'html');
  const listTitle = useString('list_title', attributeValues);
  const listData = useText('list', attributeValues, 'html');

  if (!page) {
    return <></>;
  }

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <section className="flex w-full gap-5 max-md:flex-col">
        <SlideUpTransition
          index={3}
          className="relative w-1/5 max-lg:w-1/4 max-md:mx-auto max-md:w-full max-md:max-w-[200px]"
        >
          <Image
            width={200}
            height={350}
            loading="lazy"
            src={imageSrc}
            alt={pageTitle}
            className="flex h-auto w-full"
          />
        </SlideUpTransition>
        <div className="ml-5 flex w-4/5 flex-col max-lg:w-3/4 max-md:ml-0 max-md:w-full">
          <section className="text-sm leading-5 text-neutral-600 max-md:mt-10 max-md:max-w-full">
            <SlideUpTransition index={4} className={''}>
              <h1 className="mb-5 text-xl font-bold leading-8 text-neutral-600">
                {pageTitle}
              </h1>
            </SlideUpTransition>
            {contentData && (
              <div className="max-md:max-w-full">{contentData}</div>
            )}
          </section>
          {listTitle && (
            <SlideUpTransition index={5} className={''}>
              <h2 className="mt-5 text-base font-bold leading-6 text-neutral-600 max-md:mt-10">
                {listTitle}
              </h2>
            </SlideUpTransition>
          )}
          {listData && (
            <SlideUpTransition index={6} className={'max-md:mt-10'}>
              <div className="mt-2.5 text-sm leading-5 text-neutral-600 max-md:max-w-full">
                {listData}
              </div>
            </SlideUpTransition>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
