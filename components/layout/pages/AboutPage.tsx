import parse from 'html-react-parser';
import Image from 'next/image';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { FC } from 'react';

const AboutPage: FC<{ page: IPagesEntity }> = ({ page }) => {
  const { attributeValues } = page;
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <section className="flex w-full gap-5 max-md:flex-col">
        <div className="relative w-1/5 max-lg:w-1/4 max-md:mx-auto max-md:w-full max-md:max-w-[200px]">
          <Image
            width={201}
            height={349}
            loading="lazy"
            src={attributeValues.img.value[0].downloadLink}
            className="flex h-auto w-full"
            alt="OneEntry HeadlessCMS illustration"
          />
        </div>
        <div className="ml-5 flex w-4/5 flex-col max-lg:w-3/4 max-md:ml-0 max-md:w-full">
          <section className="text-sm leading-5 text-neutral-600 max-md:mt-10 max-md:max-w-full">
            <h1 className="mb-5 text-xl font-bold leading-8 text-neutral-600">
              {attributeValues.title.value}
            </h1>
            <div className="flex flex-col gap-3">
              {parse(attributeValues.content.value[0].plainValue)}
            </div>
            <h2 className="mb-3 mt-4 text-xl font-bold underline">
              {attributeValues.list_title.value}
            </h2>
            {parse(attributeValues.list.value[0].plainValue)}
          </section>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
