import Link from 'next/link';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';

interface EmptyFavoritesProps {
  lang: string;
  dict: IAttributeValues;
}

/**
 * Empty favorites
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Empty favorites page with animations
 */
const EmptyFavorites: FC<EmptyFavoritesProps> = ({ lang, dict }) => {
  // extract data from dict
  const { empty_favorites_plug, go_to_shop } = dict;

  return (
    <FadeTransition
      className="relative box-border flex shrink-0 flex-col items-center text-center text-slate-800"
      index={2}
    >
      <svg
        width="100"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-5 size-20"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M41.5468 5.72548L41.5468 5.72547C37.5303 3.34334 32.6355 2.00018 27.2738 2C20.5292 2.00758 14.0892 4.50737 9.36032 8.91126C4.63625 13.3107 2.00805 19.2437 2 25.3996C2.00057 36.8346 9.67642 49.184 25.8363 62.0621C33.2073 67.9109 41.1708 73.0835 49.6154 77.5064C49.7276 77.5603 49.8597 77.5918 50 77.5918C50.1403 77.5918 50.2724 77.5603 50.3846 77.5064C58.8296 73.0833 66.7936 67.9104 74.1647 62.0613C90.3234 49.1839 97.9989 36.8352 98 25.4008C97.9924 19.2445 95.3642 13.311 90.6397 8.91128L91.9987 7.45188L90.6396 8.91124C85.9109 4.50737 79.4709 2.00758 72.7262 2C67.3645 2.00018 62.4697 3.34335 58.4532 5.72547L58.4532 5.72548C55.7381 7.33572 53.4197 9.42278 51.6179 11.9023L50 14.1288L48.3821 11.9023C46.5803 9.42278 44.2619 7.33572 41.5468 5.72548ZM72.7273 0C79.958 0.00784222 86.89 2.68625 92.0027 7.44764C97.1157 12.2091 99.9917 18.6647 100 25.3983C100 37.7587 91.7273 50.6231 75.409 63.627C67.9317 69.5606 59.8543 74.806 51.291 79.2894C50.894 79.488 50.4507 79.5918 50 79.5918C49.5493 79.5918 49.106 79.488 48.709 79.2894C40.1457 74.806 32.0684 69.5606 24.5909 63.627C8.27273 50.6231 0 37.7587 0 25.3983C0.00842097 18.6647 2.88449 12.2091 7.9973 7.44764C13.1101 2.68625 20.0421 0.00784222 27.2727 0C32.9681 0 38.22 1.4271 42.567 4.00526C44.8996 5.38863 46.9717 7.10343 48.7119 9.107C49.1641 9.6276 49.5939 10.1677 50 10.7266C50.4061 10.1677 50.8359 9.6276 51.2881 9.107C53.0283 7.10343 55.1004 5.38863 57.433 4.00526C61.78 1.4271 67.032 0 72.7273 0Z"
          fill="#f0f0f0"
        />
      </svg>
      <h1 className="mb-5 text-lg font-bold uppercase text-slate-600">
        {empty_favorites_plug?.value}
      </h1>
      <Link
        prefetch={true}
        href={'/' + lang + '/shop/'}
        className="btn btn-sm btn-o btn-o-primary"
      >
        {go_to_shop?.value}
      </Link>
    </FadeTransition>
  );
};

export default EmptyFavorites;
