import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';
import Placeholder from '@/components/shared/Placeholder';

interface BlocksGridCardProps {
  marker: string;
  bgColor: string;
  lang: string;
  className: {
    width: string;
    height: string;
  };
}

const BlocksGridCard: FC<BlocksGridCardProps> = async ({
  marker,
  className,
  bgColor,
  lang,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { block, isError } = await getBlockByMarker(marker, langCode);

  if (!block || !block.attributeValues || !block.isVisible || isError) {
    return <Loader />;
  }

  const attributeValues =
    block.attributeValues[langCode] || block.attributeValues;

  const { title, bg_web, link = '' } = attributeValues;

  const imageSrc = bg_web?.value[0]?.downloadLink;
  const sticker = attributeValues?.stickers;
  const stickerImage = sticker?.value[0]?.extended?.value?.downloadLink;
  const quote = attributeValues.quote?.value;
  const href =
    (link.value?.indexOf('http') === -1 ? '/' + lang + '/shop/' : '') +
      link?.value || '';
  const linkTarget = link.value?.indexOf('http') === -1 ? '' : '_blank';

  return (
    <Link
      target={linkTarget}
      href={href}
      className={`relative flex flex-col ${className.width} ${className.height} grow flex-col justify-center text-2xl font-bold text-white`}
    >
      <div
        className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
      >
        {stickerImage && (
          <div className="absolute left-3 top-3 z-10">
            <Image width={30} height={30} src={stickerImage} alt={''} />
          </div>
        )}

        <h2 className="z-10 mt-auto uppercase">{title?.value || ''}</h2>
        {quote && (
          <p className="z-10 ml-auto mt-auto w-60 max-sm:ml-0">{quote}</p>
        )}
        {imageSrc ? (
          <Image
            fill
            loading="eager"
            decoding="auto"
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={imageSrc}
            alt={title?.value || ''}
            className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </Link>
  );
};

export default BlocksGridCard;
