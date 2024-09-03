import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IListTitle } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import React, { useEffect, useMemo, useState } from 'react';

import { useGetSingleAttributeByMarkerSet } from '@/app/api';
import Loader from '@/components/shared/Loader';

import ColorPicker from './ColorPicker';

interface Props {
  color_filter_title?: string;
}

type Color = {
  code: string;
  name: string;
  selected?: boolean;
};

const ColorFilter: React.FC<Props> = ({ color_filter_title }) => {
  const { attributes, loading, error } = useGetSingleAttributeByMarkerSet({
    setMarker: 'system_content',
    attributeMarker: 'color_filters',
  });
  const [activeColor, setActiveColor] = useState<string | null>('');

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const pathname = usePathname();
  const { replace } = useRouter();

  const colorFilters = useMemo(() => {
    let colors: Color[] = [];
    if (!attributes) {
      return colors;
    }
    colors = attributes.listTitles.reduce(
      (arr: Color[], option: IListTitle) => {
        const color: Color = {
          code: option.value.toString(),
          name: option.title,
        };
        arr.push(color);
        return arr;
      },
      [],
    );
    return colors;
  }, [attributes]);

  useEffect(() => {
    if (activeColor) {
      params.set('color', activeColor);
    } else {
      params.delete('color');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [activeColor]);

  if ((!loading && !attributes) || error || loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-5">{color_filter_title}</div>
      <div className="mb-9 flex flex-wrap gap-5 whitespace-nowrap text-sm leading-8 text-slate-300">
        {colorFilters.map((color, index) => {
          return (
            <ColorPicker
              key={index}
              code={color.code}
              name={color.name}
              setActiveColor={setActiveColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorFilter;
