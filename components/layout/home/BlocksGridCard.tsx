import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';
import Loader from '@/components/shared/Loader';
import Placeholder from '@/components/shared/Placeholder';

interface BlocksGridCardProps {
  marker: string;
  bgColor: string;
  className: {
    width: string;
    height: string;
  };
}

const BlocksGridCard: FC<BlocksGridCardProps> = async ({
  marker,
  className,
  bgColor,
}) => {
  const langCode = 'en_US';
  const { block, isError } = await getBlockByMarker(marker, langCode);

  if (!block || !block.attributeValues || !block.isVisible || isError) {
    return <Loader />;
  }

  const { title, bg_web, link = '' } = block.attributeValues;
  const imageSrc = bg_web?.value[0]?.downloadLink;
  const sticker = block.attributeValues.stickers;
  const quote = block.attributeValues.quote?.value;
  const href =
    (link.value.indexOf('http') === -1 ? 'shop/' : '') + link?.value || '';
  const linkTarget = link.value.indexOf('http') === -1 ? '' : '_blank';

  return (
    <Link
      target={linkTarget}
      href={href}
      className={`relative flex flex-col ${className.width} ${className.height} grow flex-col justify-center text-2xl font-bold text-white`}
    >
      <div
        className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
      >
        {sticker?.value[0] && (
          <div className="absolute left-3 top-3 z-10">
            <Image
              width={30}
              height={30}
              src={sticker.value[0].extended?.value.downloadLink}
              alt={''}
            />
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
