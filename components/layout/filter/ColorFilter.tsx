import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IListTitle } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import React, { useEffect, useMemo } from 'react';

import { useGetSingleAttributeByMarkerSet } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addFilter, removeFilter } from '@/app/store/reducers/FilterSlice';

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
  const dispatch = useAppDispatch();
  const { attributes, loading, error } = useGetSingleAttributeByMarkerSet({
    setMarker: 'system_content',
    attributeMarker: 'color_filters',
  });
  const { colorFilterActive: activeColor, colorFilterPrevious } =
    useAppSelector(
      (state: {
        filterReducer: {
          colorFilterActive?: number;
          colorFilterPrevious?: number;
        };
      }) => state.filterReducer,
    );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const colorFilters = useMemo(() => {
    let colors: Color[] = [];
    if (!attributes) {
      return colors;
    }
    colors = attributes?.listTitles.reduce(
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
    const params = new URLSearchParams(searchParams);

    if (colorFilters?.[colorFilterPrevious as number]?.code) {
      const oldFilter: IFilterParams = {
        attributeMarker: 'color',
        conditionMarker: 'in',
        conditionValue: colorFilters[colorFilterPrevious as number].code,
        pageUrl: ['shop'],
      };
      params.delete('color');
      dispatch(removeFilter(oldFilter));
    }

    if (colorFilters?.[activeColor as number]?.code) {
      const newFilter: IFilterParams = {
        attributeMarker: 'color',
        conditionMarker: 'in',
        conditionValue: colorFilters[activeColor as number].code,
        pageUrl: ['shop'],
      };
      params.set('color', colorFilters[activeColor as number].code);
      dispatch(addFilter(newFilter));
    }
    replace(`${pathname}?${params.toString()}`);
  }, [activeColor]);

  if (!loading && !attributes) {
    return <></>;
  }

  if (error) {
    return <div />;
  }

  if (loading) {
    return <div />;
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>{color_filter_title}</div>
      <div className="mb-9 flex flex-wrap gap-5 whitespace-nowrap text-sm leading-8 text-slate-300">
        {colorFilters.map((color, index) => {
          return (
            <ColorPicker
              key={index}
              index={index}
              code={color.code}
              name={color.name}
              active={activeColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorFilter;
