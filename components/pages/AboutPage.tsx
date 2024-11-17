import parse from 'html-react-parser';
import Image from 'next/image';
import type { FC } from 'react';

import SlideUpTransition from '@/app/animations/SlideUpTransition';
import type { SimplePageProps } from '@/app/types/global';

/**
 * About page
 * @param page Represents a page entity object.
 *
 * @returns About page
 */
const AboutPage: FC<SimplePageProps> = ({ page }) => {
  if (!page) {
    return;
  }

  // Extract content from page attributeValues
  const {
    attributeValues: { img, title, content, list_title, list },
  } = page;

  const pageTitle = title?.value || '';
  const imageSrc = img?.value[0].downloadLink || '';

  const contentAttr = content?.value[0] || '';
  const contentData =
    (contentAttr?.htmlValue || contentAttr?.plainValue) &&
    parse(contentAttr?.htmlValue || contentAttr?.plainValue);

  const listTitle = list_title?.value;
  const listAttr = list?.value[0] || '';
  const listData =
    (listAttr.htmlValue || listAttr.plainValue) &&
    parse(listAttr.htmlValue || listAttr.plainValue);

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
              <SlideUpTransition index={5} className={'flex flex-col gap-3'}>
                {contentData}
              </SlideUpTransition>
            )}
            {listTitle && (
              <SlideUpTransition index={6} className={''}>
                <h2 className="mb-3 mt-4 text-xl font-bold underline">
                  {listTitle}
                </h2>
              </SlideUpTransition>
            )}
            {listData && (
              <SlideUpTransition index={7} className={''}>
                {listData}
              </SlideUpTransition>
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
