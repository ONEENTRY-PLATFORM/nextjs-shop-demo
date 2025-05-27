import type { Dispatch, FC, SetStateAction } from 'react';

interface ColorPickerProps {
  code: string;
  name: string;
  setActiveColor: Dispatch<SetStateAction<string>>;
  activeColor: string;
}

/**
 * Color picker
 * @param code color code
 * @param name color name
 * @param setActiveColor setActiveColor function
 *
 * @returns single color picker
 */
const ColorPicker: FC<ColorPickerProps> = ({
  code,
  name,
  activeColor,
  setActiveColor,
}) => {
  return (
    <button
      className={
        'flex gap-1.5 rounded-full pl-1 pr-2 transition-colors w-24 ' +
        (code === activeColor
          ? 'bg-slate-100 text-neutral-700'
          : 'hover:bg-slate-100')
      }
      onClick={() => {
        if (code !== activeColor) {
          setActiveColor(code);
        } else {
          setActiveColor('');
        }
      }}
    >
      <div
        className={'my-auto size-6 rounded-full '}
        style={{
          backgroundColor: code,
        }}
      ></div>
      <span className="leading-6">{name}</span>
    </button>
  );
};

export default ColorPicker;
