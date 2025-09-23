/* eslint-disable react/prop-types */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  IAttributesSetsEntity,
  IListTitle,
} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

interface ColorFilterProps {
  title?: string;
  attributes: IAttributesSetsEntity | IError;
}

type Color = {
  code: string;
  name: string;
};

/**
 * Color filter
 * @param title
 * @param attributes Represents a template entity object.
 *
 * @returns Color filter
 */

const ColorFilter: FC<ColorFilterProps> = memo(({ title, attributes }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString() || '');
  const [currentColor, setCurrentColor] = useState<string>(
    params.get('color') || '',
  );

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  // Update URL when currentColor changes
  useEffect(() => {
    const newParams = new URLSearchParams(params);
    if (currentColor) {
      newParams.set('color', currentColor);
    } else {
      newParams.delete('color');
    }
    // Navigate to the provided href. Replaces the current history entry.
    replace(`${pathname}?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentColor, pathname, replace]);

  // Extract color options from attributes
  const colors: Color[] =
    attributes && !('error' in attributes)
      ? attributes.listTitles.map((item: IListTitle) => ({
          code: item.value.toString(),
          name: item.title,
        }))
      : [];

  if (!attributes || 'error' in attributes) {
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
        {colors.map((color: { code: string; name: string }, index: Key) => (
          <button
            key={index}
            className={
              'flex cursor-pointer gap-1.5 rounded-full pl-1 pr-2 transition-colors w-24 ' +
              (color.code === currentColor
                ? 'bg-slate-100 text-neutral-700'
                : 'hover:bg-slate-100')
            }
            onClick={() => handleColorChange(color.code)}
          >
            <div
              className={'my-auto size-6 rounded-full '}
              style={{
                backgroundColor: color.code,
              }}
            ></div>
            <span className="leading-6">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

ColorFilter.displayName = 'ColorFilter';

export default ColorFilter;
