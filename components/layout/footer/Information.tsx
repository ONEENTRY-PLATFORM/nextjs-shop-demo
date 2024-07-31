import React from "react";

interface LinkItem {
  text: string;
  href: string;
}

const infoLinks: LinkItem[] = [
  { 
    text: "Book online", 
    href: "/book" },
  { 
    text: "Delivery", 
    href: "/delivery" 
  },
  { 
    text: "Offers & events", 
    href: "/offers" 
  },
  { 
    text: "Purchase a gift card", 
    href: "/gifts" 
  },
  { 
    text: "Pricing & package", 
    href: "/package" 
  },
  { 
    text: "Payments", 
    href: "/payments" 
  },
];

const Information: React.FC = () => {
  return (
    <div className="flex flex-col w-[21%] max-md:w-full">
      <nav className="flex flex-col text-neutral-600">
        <h2 className="mb-5 text-xl font-bold">
          Information
        </h2>
        <ul className="flex flex-col gap-1.5 text-sm font-semibold">
          {infoLinks.map((link, index) => (
            <li key={index} className="box-border relative">
              <a className="hover:text-red-500" href={link.href}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Information;
