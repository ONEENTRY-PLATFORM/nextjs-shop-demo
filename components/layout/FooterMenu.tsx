import React from 'react';
import ContactInfo from './ContactInfo';
import QuickLinks from './QuickLinks';
import Information from './Information';

interface FooterProps {
  logoSrc: string;
}

const FooterMenu: React.FC<FooterProps> = ({ logoSrc }) => {
  return (
    <footer className="flex justify-center items-center px-5 py-10 w-full bg-gray-200 max-md:px-5 max-md:max-w-full">
      <div className="max-w-full w-[1235px]">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
            <img 
              loading="lazy" 
              src={logoSrc} 
              alt="Company Logo" 
              className="shrink-0 max-w-full aspect-[3.57] w-[253px] max-sm:mb-5" 
            />
          </div>
          <ContactInfo />
          <QuickLinks />
          <Information />
        </div>
      </div>
    </footer>
  );
};

export default FooterMenu;