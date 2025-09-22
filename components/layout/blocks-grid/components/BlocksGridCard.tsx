import { Baloo_2 as Baloo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import BlockCardAnimations from '@/components/layout/blocks-grid/animations/BlockCardAnimations';

import BlocksGridImage from './BlocksGridImage';
import BlocksGridTitle from './BlocksGridTitle';

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

interface BlocksGridCardProps {
  marker: string;
  bgColor: string;
  lang: string;
  className: {
    width: string;
    height: string;
  };
  index: number;
}

/**
 * Blocks grid card
 *
 * @param marker text marker of block
 * @param bgColor card background color
 * @param lang current language shortcode
 * @param className card className
 * @param index index of element in array for stagger
 *
 * @returns block card with animations
 */
const BlocksGridCard: FC<BlocksGridCardProps> = async ({
  marker,
  bgColor,
  lang,
  className,
  index,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  // Get block by marker from the API.
  const { block, isError } = await getBlockByMarker(marker, lang);

  // extract attributeValues from block
  const attributeValues =
    block?.attributeValues[langCode] || block?.attributeValues;

  if (!attributeValues) {
    return 'Block error';
  }

  // extract data from block attributeValues
  const { title = '', link = '', stickers } = attributeValues;

  const stickerImage = stickers?.value[0]?.extended?.value?.downloadLink;
  // const quoteValue = quote?.value;

  if (!block || isError) {
    return 'Block error';
  }

  return (
    <BlockCardAnimations
      className={`${baloo.className} block-card group relative flex flex-col ${className.width} ${className.height} grow flex-col justify-center text-2xl font-bold text-white`}
      index={index}
    >
      <Link
        target={link.value?.indexOf('http') === -1 ? '' : '_blank'}
        href={
          (link.value?.indexOf('http') === -1 ? '/' + lang + '/shop/' : '') +
            link?.value || ''
        }
        className={'size-full'}
      >
        <div
          className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
        >
          {/* sticker */}
          {stickerImage && (
            <div className="absolute left-3 top-3 z-10">
              <Image width={30} height={30} src={stickerImage} alt={''} />
            </div>
          )}

          {/* title */}
          <BlocksGridTitle identifier={block.identifier} title={title} />

          {/* Image/Placeholder */}
          <BlocksGridImage attributeValues={attributeValues} />
          <div className="radial-hover"></div>
        </div>
      </Link>
    </BlockCardAnimations>
  );
};

export default BlocksGridCard;
