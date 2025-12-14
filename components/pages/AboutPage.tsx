import Image from 'next/image';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { JSX } from 'react';

import SlideUpTransition from '@/app/animations/SlideUpTransition';

import {
  getImageUrl,
  getString,
  getText,
} from '../../app/api/hooks/useAttributesData';

/**
 * About page component that displays information about the company.
 * This component renders the about page content including title, image, and descriptive content
 * with animations for a smooth user experience.
 * @param   {object}       props      - Component properties
 * @param   {IPagesEntity} props.page - Represents a page entity object containing about page data from CMS
 * @returns {JSX.Element}             About page with content and animations
 */
const AboutPage = ({ page }: { page: IPagesEntity }): JSX.Element => {
  /** Safely check if page exists and has attribute values */
  if (!page || !page.attributeValues) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <h1>About Us</h1>
        <p>About us page content.</p>
      </div>
    );
  }

  /** Safely extract content from page using utility functions */
  const attributeValues = page.attributeValues;
  /** Extract page title from attribute values */
  const pageTitle = getString('title', attributeValues);
  /** Extract image source URL from attribute values */
  const imageSrc = getImageUrl('img', attributeValues);
  /** Extract main content text from attribute values */
  const contentData = getText('content', attributeValues, 'html');
  /** Extract list title from attribute values */
  const listTitle = getString('list_title', attributeValues);
  /** Extract list content from attribute values */
  const listData = getText('list', attributeValues, 'html');

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      {/** Main content section with image and text */}
      <section className="flex w-full gap-5 max-md:flex-col">
        {/** Animated image container */}
        <SlideUpTransition
          index={3}
          className="relative w-1/5 max-lg:w-1/4 max-md:mx-auto max-md:w-full max-md:max-w-50"
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

        {/** Text content section */}
        <div className="ml-5 flex w-4/5 flex-col max-lg:w-3/4 max-md:ml-0 max-md:w-full">
          {/** Main content text with animations */}
          <section className="text-sm leading-5 text-neutral-600 max-md:mt-10 max-md:max-w-full">
            {/** Page title with slide up animation */}
            <SlideUpTransition index={4} className={''}>
              <h1 className="mb-5 text-xl font-bold leading-8 text-neutral-600">
                {pageTitle}
              </h1>
            </SlideUpTransition>

            {/** Main content data with slide up animation */}
            {contentData && (
              <SlideUpTransition index={5} className={''}>
                <div className="max-md:max-w-full">{contentData}</div>
              </SlideUpTransition>
            )}
          </section>

          {/** List section with title and content */}
          {/** List title with slide up animation */}
          {listTitle && (
            <SlideUpTransition index={6} className={''}>
              <h2 className="mt-5 text-base font-bold leading-6 text-neutral-600 max-md:mt-10">
                {listTitle}
              </h2>
            </SlideUpTransition>
          )}

          {/** List content with slide up animation */}
          {listData && (
            <SlideUpTransition index={7} className={'max-md:mt-10'}>
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
