import React from "react";

interface NavigationButtonProps {
  direction: "left" | "right";
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ direction }) => {
  const imageSrc = direction === "left" ? "./icons/arrow-left.svg" : "./icons/arrow-right.svg";
  const altText = `Navigate ${direction}`;

  return (
    <button className="flex border border-neutral-200 w-8 aspect-square rounded-full justify-center items-center">
      <img
        loading="lazy"
        src={imageSrc}
        alt={altText}
        className="shrink-0 self-stretch my-auto w-4 aspect-square"
      />
    </button>
  );
};

export default NavigationButton;
