import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { getBlockByMarker } from '@/app/api/serverSideProps';

interface CatalogCardProps {
  cardData: string;
}

const CatalogCard: React.FC<CatalogCardProps> = async ({ cardData }) => {
  const { block, isError } = await getBlockByMarker({
    marker: cardData,
    langCode: 'en_US',
  });

  if (!block?.attributeValues || isError) {
    return null;
  }

  const { title, class_name, card_width, card_height, bg_web, link } =
    block.attributeValues;
  const imageSrc = bg_web?.value[0]?.downloadLink || '/images/card.svg';
  const sticker = block.attributeValues.stickers;

  // console.log(sticker?.value.extended?.value.downloadLink);
  // console.log('!-----------------------------!');

  // return;
  return (
    <Link
      href={'shop/' + link?.value || ''}
      className={`relative flex flex-col ${card_width?.value} ${card_height?.value} grow flex-col justify-center text-2xl font-bold text-white`}
    >
      <div
        className={`relative flex size-full p-6 ${class_name?.value} overflow-hidden rounded-3xl`}
      >
        {sticker ? (
          <div className="absolute left-3 top-3 z-10">
            <Image
              width={30}
              height={30}
              src={sticker?.value.extended?.value.downloadLink}
              alt={''}
            />
          </div>
        ) : (
          ''
        )}

        <h3 className="z-10 mt-auto uppercase">{title?.value || ''}</h3>
        <Image
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={imageSrc}
          alt={title?.value || ''}
          className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover"
        />
      </div>
    </Link>
  );
};

export default CatalogCard;
