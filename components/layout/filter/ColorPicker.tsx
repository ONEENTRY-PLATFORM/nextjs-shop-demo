import { useSearchParams } from 'next/navigation';
import type { Dispatch } from 'react';
import React, { memo } from 'react';

interface Props {
  code: string;
  name: string;
  key: number;
  setActiveColor: Dispatch<React.SetStateAction<string>>;
}

const ColorPicker: React.FC<Props> = ({ code, name, setActiveColor }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const currentColor = params.get('color');
  const isActive = code === currentColor;

  return (
    <button
      className={
        'flex gap-1.5 rounded-full pl-1 pr-2 ' +
        (isActive ? 'bg-neutral-100' : '')
      }
      onClick={() => {
        if (isActive) {
          setActiveColor('');
        } else {
          console.log(isActive);
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

// export default memo(ColorPicker);
export default ColorPicker;
