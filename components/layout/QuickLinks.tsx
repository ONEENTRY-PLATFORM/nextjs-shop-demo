import React from 'react';

const QuickLinks: React.FC = () => {
  const links = [
    "About us",
    "Service",
    "Treatment",
    "Product",
    "Our experts",
    "Support",
    "Contact"
  ];

  return (
    <div className="flex flex-col ml-5 w-[24%] max-md:ml-0 max-md:w-full">
      <nav className="flex flex-col text-neutral-600 max-sm:mb-5">
        <h2 className="mb-5 text-xl font-bold">Quick Link</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold leading-5">
          {links.map((link, index) => (
            <li key={index} className="box-border relative">{link}</li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default QuickLinks;