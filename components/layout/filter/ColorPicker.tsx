import React, { memo } from 'react';

interface Props {
  code: string;
  name: string;
  active: string;
  key: number;
  setActiveColor: any;
}

const ColorPicker: React.FC<Props> = ({ code, name, active, setActiveColor }) => {
  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => {
          if (code === active) {
            setActiveColor('');
          } else {
            setActiveColor(code);
          }
        }}
        className={
          'size-6 rounded-full ' + ((code === active) ? 'outline outline-neutral-400' : '')
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
