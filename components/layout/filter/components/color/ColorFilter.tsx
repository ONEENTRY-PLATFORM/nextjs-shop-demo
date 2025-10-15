'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  IAttributesSetsEntity,
  IListTitle,
} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { JSX, Key } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

/**
 * Color filter interface representing a single color option.
 * @param {string} code - Color code in hex format (e.g., "#FF0000")
 * @param {string} name - Human-readable color name (e.g., "Red")
 */
type Color = {
  code: string;
  name: string;
};

/**
 * Color filter component that displays color options for product filtering.
 * This component renders a list of color options that users can select to filter products.
 * @param   {object}                         props            - Component properties
 * @param   {string}                         [props.title]    - Filter title to display above color options
 * @param   {IAttributesSetsEntity | IError} props.attributes - Color attributes data from API or error object
 * @returns {JSX.Element}                                     Color filter component with selectable color options
 */
const ColorFilter = memo(
  ({
    title,
    attributes,
  }: {
    title?: string;
    attributes: IAttributesSetsEntity | IError;
  }): JSX.Element => {
    /** Get current path and URL parameters for navigation */
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();

    /** Create a copy of URL parameters to work with color filter */
    const params = new URLSearchParams(searchParams?.toString() || '');
    /** State for tracking currently selected color */
    const [currentColor, setCurrentColor] = useState<string>(
      params.get('color') || '',
    );

    /**
     * Handler for changing the selected color
     * @param {string} color - Color code to select
     */
    const handleColorChange = useCallback((color: string) => {
      setCurrentColor(color);
    }, []);

    /** Update URL when currentColor changes */
    useEffect(() => {
      /** Create a new parameter set based on current parameters */
      const newParams = new URLSearchParams(params);
      if (currentColor) {
        /** Set color parameter if a color is selected */
        newParams.set('color', currentColor);
      } else {
        /** Remove color parameter if no color is selected */
        newParams.delete('color');
      }
      /** Navigate to the provided href. Replaces the current history entry. */
      replace(`${pathname}?${newParams.toString()}`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentColor, pathname, replace]);

    /** Extract color options from attributes data */
    const colors: Color[] =
      attributes && !('error' in attributes)
        ? attributes.listTitles.map((item: IListTitle) => ({
            code: item.value.toString(),
            name: item.title,
          }))
        : [];

    /** Display skeleton loader if attributes data is not available or contains an error */
    if (!attributes || 'error' in attributes) {
      return (
        <div>
          {/** Title skeleton */}
          <div className="mb-5 h-5 bg-slate-100">{title}</div>
          {/** Color options skeleton */}
          <div className="mb-9 flex h-5 flex-wrap gap-5 whitespace-nowrap bg-slate-100 text-sm leading-8"></div>
        </div>
      );
    }

    return (
      <div>
        {/** Filter title */}
        <div className="mb-5 text-lg text-[#4C4D56]">{title}</div>
        {/** Color options list */}
        <div className="mb-9 flex flex-wrap gap-1 whitespace-nowrap text-sm leading-8 text-slate-400">
          {colors.map((color: Color, index: Key) => (
            /* Color option button with dynamic styling based on selection state */
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
              {/** Color swatch display */}
              <div
                className={'my-auto size-6 rounded-full '}
                style={{
                  backgroundColor: color.code,
                }}
              ></div>
              {/** Color name label */}
              <span className="leading-6">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

ColorFilter.displayName = 'ColorFilter';

export default ColorFilter;
