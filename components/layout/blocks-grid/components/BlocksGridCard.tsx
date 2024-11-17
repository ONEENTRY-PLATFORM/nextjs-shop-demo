import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import BlockCardAnimations from '@/components/layout/blocks-grid/animations/BlockCardAnimations';
import Placeholder from '@/components/shared/Placeholder';

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

  if (!block || isError) {
    return 'Block error';
  }

  // extract attributeValues from block
  const attributeValues =
    block.attributeValues[langCode] || block.attributeValues;

  // extract data from block attributeValues
  const { title, bg_web, link = '', stickers, quote } = attributeValues;

  const stickerImage = stickers?.value[0]?.extended?.value?.downloadLink;
  const quoteValue = quote?.value;
  const imageSrc = bg_web?.value[0]?.downloadLink;

  return (
    <BlockCardAnimations
      className={`block-card group relative flex flex-col ${className.width} ${className.height} grow flex-col justify-center text-2xl font-bold text-white`}
      index={index}
    >
      <Link
        prefetch={true}
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
          <h2 className="z-10 mt-auto uppercase">{title?.value || ''}</h2>

          {/* quote */}
          {quoteValue && (
            <p className="z-10 ml-auto mt-auto w-60 max-sm:ml-0">
              {quoteValue}
            </p>
          )}

          {/* Image/Placeholder */}
          {imageSrc ? (
            <Image
              fill
              fetchPriority="high"
              sizes="(min-width: 1024px) 66vw, 100vw"
              src={imageSrc}
              alt={title?.value || ''}
              className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover transition-transform duration-500 group-hover:scale-125"
            />
          ) : (
            <div className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover opacity-15 invert">
              <Placeholder />
            </div>
          )}
        </div>
      </Link>
    </BlockCardAnimations>
  );
};

export default BlocksGridCard;
