import React from 'react';

const infoLinks = [
  "Book online",
  "Delivery",
  "Offers & events",
  "Purchase a gift card",
  "Pricing & package",
  "Payments"
];

const Information: React.FC = () => {

  return (
    <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">Information</h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {infoLinks.map((link, index) => (
            <li key={index} className="box-border relative">{link}</li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Information;