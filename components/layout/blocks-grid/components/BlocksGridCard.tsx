/* eslint-disable @typescript-eslint/no-explicit-any */
import { Baloo_2 as Baloo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import BlockCardAnimations from '@/components/layout/blocks-grid/animations/BlockCardAnimations';

import BlocksGridImage from './BlocksGridImage';
import BlocksGridTitle from './BlocksGridTitle';

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

/**
 * Blocks grid card component that renders individual content blocks in a grid layout
 * Fetches block data by marker from API and displays it with title, image, and optional sticker
 * Supports external and internal links with appropriate target handling
 * Wrapped with animation component for entrance effects with staggered timing
 * @param   {object}                props              - Component props
 * @param   {string}                props.marker       - Text marker used to identify and fetch the specific block
 * @param   {number}                props.index        - Index of element in array for staggered animations
 * @param   {string}                props.lang         - Current language shortcode for content localization
 * @param   {string}                props.className    - CSS classes object for styling the card
 * @param   {object}                props.blocksColors - Object containing colors for each block type
 * @returns {Promise<ReactElement>}                    Block card component with content and animations
 */
const BlocksGridCard = async ({
  marker,
  index,
  lang,
  className,
  blocksColors,
}: {
  marker: string;
  lang: string;
  className: string;
  index: number;
  blocksColors: any;
}): Promise<ReactElement> => {
  /** Convert language shortcode to language code for API requests */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Fetch block data from API using the provided marker and language */
  const { block, isError } = await getBlockByMarker(marker, lang);

  /** Extract attribute values from block data, prioritizing language-specific values */
  const attributeValues =
    block?.attributeValues[langCode] || block?.attributeValues;

  /** Return error message if no attribute values are found */
  if (!attributeValues) {
    return <>Block error</>;
  }

  /** Extract content data from block attribute values */
  const { title = '', link = '', stickers } = attributeValues;

  /** Extract sticker image URL if available */
  const stickerImage = stickers?.value[0]?.extended?.value?.downloadLink;
  // const quoteValue = quote?.value;

  /** Return error message if block data is missing or API returned an error */
  if (!block || isError) {
    return <>Block error</>;
  }

  /** bgColor */
  const bgColor = blocksColors[marker as keyof typeof blocksColors] || '';

  return (
    /** Wrap card with animation component for entrance effects */
    <BlockCardAnimations
      className={`${baloo.className} block-card group relative flex flex-col ${className} grow flex-col justify-center text-2xl font-bold text-white`}
      index={index}
    >
      {/** Link wrapper with dynamic target and href based on link type */}
      <Link
        target={link.value?.indexOf('http') === -1 ? '' : '_blank'}
        href={
          (link.value?.indexOf('http') === -1 ? '/' + lang + '/shop/' : '') +
            link?.value || ''
        }
        className={'size-full'}
      >
        {/** Card content container with background color and rounded corners */}
        <div
          className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
        >
          {/** Optional sticker image positioned at top-left corner */}
          {stickerImage && (
            <div className="absolute left-3 top-3 z-10">
              <Image width={30} height={30} src={stickerImage} alt={''} />
            </div>
          )}

          {/** Block title component that renders either YouTube icon or text title */}
          <BlocksGridTitle identifier={block.identifier} title={title} />

          {/** Block image component that renders optimized background image */}
          <BlocksGridImage attributeValues={attributeValues} />

          {/** Radial hover effect overlay */}
          <div className="radial-hover"></div>
        </div>
      </Link>
    </BlockCardAnimations>
  );
};

export default BlocksGridCard;
