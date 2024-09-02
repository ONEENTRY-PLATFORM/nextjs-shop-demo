/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useMemo, useState } from 'react';

import { useGetPage } from '@/app/api/hooks/useGetPage';

import AvailabilityFilter from './AvailabilityFilter';
import ColorFilter from './ColorFilter';
import FilterButtons from './FilterButtons';
import PricePickerFilter from './PricePickerFilter';

function sortObjectFieldsByPosition(obj: Record<any, any>) {
  const entries = Object.entries(obj);
  entries.sort((a, b) => a[1].position - b[1].position);
  const sortedObj = {};
  for (const [key, value] of entries) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortedObj[key] = value;
  }
  return sortedObj;
}

const FiltersForm: React.FC = () => {
  const { pageInfo } = useGetPage({ pageUrl: 'catalog_filters' });

  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();
  // const router = useRouter();
  // const [state, setState] = useState(false);

  // const handleSearch = (term: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set('search', term);
  //     setState(true);
  //   } else {
  //     params.delete('search');
  //     setState(false);
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const params = new URLSearchParams(searchParams);
  //   router.push(`/shop?${params.toString()}`);
  //   setState(false);
  // };

  const sortedAttributes: Record<any, any> = useMemo(() => {
    if (!pageInfo) {
      return [];
    }
    return sortObjectFieldsByPosition(pageInfo?.attributeValues);
  }, [pageInfo]);

  return (
    <div className="flex w-full flex-col px-10 pb-16 pt-5">
      {Object.keys(sortedAttributes).map((attribute, index) => {
        if (attribute === 'color_filter') {
          return (
            <ColorFilter
              key={index}
              color_filter_title={sortedAttributes[attribute]?.value}
            />
          );
        }

        // if (attribute === 'price_filter') {
        //   return <PricePickerFilter key={index} />;
        // }

        if (attribute === 'availability_filter') {
          return (
            <AvailabilityFilter
              key={index}
              title={sortedAttributes[attribute]?.value}
            />
          );
        }
      })}

      <FilterButtons />
    </div>
  );
};

export default memo(FiltersForm);
function setState(arg0: boolean) {
  throw new Error('Function not implemented.');
}
