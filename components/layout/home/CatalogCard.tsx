import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api/serverSideProps';

interface CatalogCardProps {
  cardData: string;
  index: number;
}

const CatalogCard: FC<CatalogCardProps> = async ({ cardData }) => {
  const { block, isError } = await getBlockByMarker({
    marker: cardData,
    langCode: 'en_US',
  });

  const classNames = {
    home_banner: {
      class_name: 'bg-amber-600',
      card_width: 'w-full',
      card_height: 'h-[175px]',
    },
    offer_best_seller: {
      class_name: 'bg-purple-600',
      card_width:
        'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      card_height: 'h-[260px]',
    },
    offer_promotion: {
      class_name: 'bg-blue-500',
      card_width:
        'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      card_height: 'h-[260px]',
    },
    offer_offer_day: {
      class_name: 'bg-lime-700',
      card_width:
        'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      card_height: 'h-[260px]',
    },
    offer_new_arrivals: {
      class_name: 'bg-teal-300',
      card_width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      card_height: 'h-[260px]',
    },
    offer_youtube: {
      class_name: 'bg-amber-300',
      card_width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      card_height: 'h-[260px]',
    },
  };

  if (!block || !block.attributeValues || !block.isVisible || isError) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, class_name, card_width, card_height, bg_web, link } =
    block.attributeValues;
  const imageSrc = bg_web?.value[0]?.downloadLink || '/images/placeholder.jpg';
  const sticker = block.attributeValues.stickers;
  const quote = block.attributeValues.quote?.value || '';

  const className = classNames[cardData as keyof typeof classNames];

  return (
    <Link
      href={'shop/' + link?.value || ''}
      className={`relative flex flex-col ${className.card_width} ${className.card_height} grow flex-col justify-center text-2xl font-bold text-white`}
    >
      <div
        className={`relative flex size-full p-6 ${className.class_name} overflow-hidden rounded-3xl`}
      >
        {sticker?.value[0] ? (
          <div className="absolute left-3 top-3 z-10">
            <Image
              width={30}
              height={30}
              src={sticker.value[0].extended?.value.downloadLink}
              alt={''}
            />
          </div>
        ) : (
          ''
        )}

        <h2 className="z-10 mt-auto uppercase">{title?.value || ''}</h2>
        {quote && <p className="z-10 ml-auto mt-auto w-60">{quote}</p>}
        {imageSrc && (
          <Image
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={imageSrc}
            alt={title?.value || ''}
            className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover"
          />
        )}
      </div>
    </Link>
  );
};

export default CatalogCard;
