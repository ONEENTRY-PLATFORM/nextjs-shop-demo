import Image from 'next/image';
import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api/serverSideProps';
import Loader from '@/components/shared/Loader';

const image = {
  src: '/images/about-image.svg',
  with: 200,
  height: 300,
};

const features = [
  {
    title: 'The most user-friendly content management for any platform.',
    description:
      'This is a unique solution for the most convenient content development, creation and management. Easily port content to any platform: websites, mobile apps, commercial electronic devices (info panels, advertising boards, eMenu, etc).',
  },
  {
    title:
      'Use the most state-of-the-art development tools to the max for fast and high-quality results.',
    description:
      'Perfect focus on developer tasks. Choose development tools you find the most convenient - Vue, React, Angular, Kotlin, JAVA, Swift and many other. Headless CMS only stores content no matter the interface, so you can use a ready-made backend for any project, on any platform. Such advantageous approach provides a ready-made backend with scalable, flexible system, and the possibility to manage all websites and apps on a singular platform. This HCMS concept reduces development financial costs and enables practically unlimited scaling.',
  },
  {
    title: 'Easy solution for content creators.',
    description:
      'User-friendly interface for adding and editing text, images, and creating forms. The system is geared towards convenience of use for all members of the team, from developers to content creators and marketing experts.',
  },
  {
    title: 'Be one the same wavelength with your users.',
    description:
      'The system makes it possible to work with projects in multiple languages. Manage content in various languages and arrange your content structure depending on the language used',
  },
];

const listItems = [
  'Create structure and content that will work perfectly on Frontend. Diversify your content with automatically optimized images.',
  "Keep in touch with your users via feedback forms, surveys and reviews. We're making managing these tools fast and easy with our system.",
  'Full set of tools for online stores: goods catalogue import, reception and confirmation of orders, discounts, deals, delivery and payment management, user profile creation, statistics analysis. All necessary tools for omni-channel sales.',
  'OneEntry offers a full set of tools to make your work comfortable.',
];

const AboutPage = async () => {
  const { page, isError } = await getPageByUrl('about_us', 'en_US');
  if (!page || isError) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { attributeValues, localizeInfos } = page;
  // attributeValues.list_title.value
  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <section className="flex w-full gap-5 max-md:flex-col">
          <div className="relative flex w-[18%] max-md:w-full">
            <Image
              width={200}
              height={400}
              sizes="(min-width: 600px) 66vw, 100vw"
              loading="lazy"
              src={image.src}
              className="w-[200px] max-w-full shrink-0 max-md:mt-10"
              alt="OneEntry HeadlessCMS illustration"
            />
          </div>
          <div className="ml-5 flex w-[82%] flex-col max-md:ml-0 max-md:w-full">
            <section className="text-sm leading-5 text-neutral-600 max-md:mt-10 max-md:max-w-full">
              <h1 className="mb-5 text-xl font-bold leading-8 text-neutral-600">
                {attributeValues.title.value}
              </h1>
              <div className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <div key={index}>
                    <h2 className="mb-3 text-xl font-bold underline">
                      {feature.title}
                    </h2>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
              <h2 className="mb-3 mt-4 text-xl font-bold underline">
                {attributeValues.list_title.value}
              </h2>
              <ul>
                {listItems.map((item, index) => (
                  <li className="mb-3" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </Suspense>
    </div>
  );
};

export default AboutPage;
