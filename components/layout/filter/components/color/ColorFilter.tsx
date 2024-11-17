'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  IAttributesSetsEntity,
  IListTitle,
} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import ColorPicker from './ColorPicker';

interface ColorFilterProps {
  title?: string;
  attributes: IAttributesSetsEntity | IError;
}

type Color = {
  code: string;
  name: string;
  selected?: boolean;
};

/**
 * Color filter
 * @param title
 * @param attributes Represents a template entity object.
 *
 * @returns Color filter
 */
const ColorFilter: FC<ColorFilterProps> = ({ title, attributes }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [activeColor, setActiveColor] = useState<string>(
    params.get('color') || '',
  );

  // get colorFilters from attributes
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

  // set URLSearchParams on activeColor change
  useEffect(() => {
    if (activeColor) {
      params.set('color', activeColor);
    } else {
      params.delete('color');
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColor]);

  if (!attributes) {
    return (
      <div>
        <div className="mb-5 h-5 bg-slate-100">{title}</div>
        <div className="mb-9 flex h-5 flex-wrap gap-5 whitespace-nowrap bg-slate-100 text-sm leading-8"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 text-lg text-[#4C4D56]">{title}</div>
      <div className="mb-9 flex flex-wrap gap-1 whitespace-nowrap text-sm leading-8 text-slate-400">
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
