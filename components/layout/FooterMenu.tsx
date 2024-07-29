import React from "react";
import ContactInfo from "./footer/ContactInfo";
import QuickLinks from "./footer/QuickLinks";
import Information from "./footer/Information";

interface FooterProps {
  logoSrc: string;
}

const FooterMenu: React.FC<FooterProps> = ({ logoSrc }) => {
  return (
    <footer className="flex justify-center items-center px-5 py-10 w-full bg-gray-200 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-row gap-16 justify-between items-start max-w-full w-[1240px]">
        <img
          loading="lazy"
          src={logoSrc}
          alt="Company logo"
          className="shrink-0 max-w-full aspect-[3.57] w-[253px] max-sm:mb-5"
        />
        <ContactInfo />
        <QuickLinks />
        <Information />
      </div>
    </footer>
  );
};

export default FooterMenu;
