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

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => {
          if (code === currentColor) {
            setActiveColor('');
          } else {
            setActiveColor(code);
          }
        }}
        className={
          'size-6 rounded-full ' +
          (code === currentColor ? 'outline outline-neutral-400' : '')
        }
        style={{
          backgroundColor: code,
        }}
      ></button>
      <span className="my-auto">{name}</span>
    </div>
  );
};

export default memo(ColorPicker);
