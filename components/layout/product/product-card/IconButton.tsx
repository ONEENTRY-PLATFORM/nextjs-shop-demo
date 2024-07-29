import React from "react";

interface IconButtonProps {
  iconSrc: string;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc }) => {
  return (
    <button className="box-border flex relative flex-col shrink-0 border border-none bg-black bg-opacity-0 border-[black]">
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="shrink-0 aspect-square w-[26px]"
      />
    </button>
  );
};

export default IconButton;
