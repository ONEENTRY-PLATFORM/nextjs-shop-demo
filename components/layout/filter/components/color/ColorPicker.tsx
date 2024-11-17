import { useSearchParams } from 'next/navigation';
import type { Dispatch, FC, SetStateAction } from 'react';
import { memo } from 'react';

interface ColorPickerProps {
  code: string;
  name: string;
  setActiveColor: Dispatch<SetStateAction<string>>;
}

/**
 * Color picker
 * @param code color code
 * @param name color name
 * @param setActiveColor setActiveColor function
 *
 * @returns single color picker
 */
const ColorPicker: FC<ColorPickerProps> = ({ code, name, setActiveColor }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const currentColor = params.get('color');
  const isActive = code === currentColor;

  return (
    <button
      className={
        'flex gap-1.5 rounded-full pl-1 pr-2 transition-colors w-24 ' +
        (isActive ? 'bg-slate-100' : 'hover:bg-slate-100')
      }
      onClick={() => {
        if (isActive) {
          setActiveColor('');
        } else {
          setActiveColor(code);
        }
      }}
    >
      <div
        className={'my-auto size-6 rounded-full '}
        style={{
          backgroundColor: code,
        }}
      ></div>
      <span className={'leading-6' + isActive ? 'text-neutral-700' : ''}>
        {name}
      </span>
    </button>
  );
};

export default memo(ColorPicker);
