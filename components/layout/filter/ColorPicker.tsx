import { useSearchParams } from 'next/navigation';
import React, { memo } from 'react';

interface Props {
  code: string;
  name: string;
  key: number;
  setActiveColor: any;
}

const ColorPicker: React.FC<Props> = ({ code, name, setActiveColor }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => {
          if (code === params.get('color')) {
            setActiveColor('');
          } else {
            setActiveColor(code);
          }
        }}
        className={
          'size-6 rounded-full ' + ((code === params.get('color')) ? 'outline outline-neutral-400' : '')
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
