import parse from 'html-react-parser';
import Image from 'next/image';
import type { FC } from 'react';

import type { SimplePageProps } from '@/app/types/global';

const AboutPage: FC<SimplePageProps> = ({ page }) => {
  const { attributeValues } = page;
  const content = attributeValues?.content?.value[0] || '';
  const list = attributeValues.list?.value[0] || '';

  const contentData =
    (content?.htmlValue || content?.plainValue) &&
    parse(content?.htmlValue || content?.plainValue);
  const listData =
    (list.htmlValue || list.plainValue) &&
    parse(list.htmlValue || list.plainValue);

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <section className="flex w-full gap-5 max-md:flex-col">
        <div className="relative w-1/5 max-lg:w-1/4 max-md:mx-auto max-md:w-full max-md:max-w-[200px]">
          <Image
            width={200}
            height={350}
            loading="lazy"
            src={attributeValues.img?.value[0].downloadLink}
            className="flex h-auto w-full"
            alt="..."
          />
        </div>
        <div className="ml-5 flex w-4/5 flex-col max-lg:w-3/4 max-md:ml-0 max-md:w-full">
          <section className="text-sm leading-5 text-neutral-600 max-md:mt-10 max-md:max-w-full">
            <h1 className="mb-5 text-xl font-bold leading-8 text-neutral-600">
              {attributeValues.title?.value}
            </h1>
            {contentData && (
              <div className="flex flex-col gap-3">{contentData}</div>
            )}
            <h2 className="mb-3 mt-4 text-xl font-bold underline">
              {attributeValues.list_title?.value}
            </h2>
            {listData}
          </section>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
