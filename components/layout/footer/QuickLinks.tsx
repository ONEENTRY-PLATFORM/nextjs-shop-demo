import React from "react";
import Link from 'next/link';

interface LinkItem {
  text: string;
  href: string;
}

const quickLinks: LinkItem[] = [
  { 
    text: "About us", 
    href: "/about" 
  },
  { 
    text: "Service", 
    href: "/service" 
  },
  { 
    text: "Treatment", 
    href: "/treatment" 
  },
  { 
    text: "Product", 
    href: "/" 
  },
  { 
    text: "Our experts", 
    href: "/experts" 
  },
  { 
    text: "Support", 
    href: "/support" 
  },
  { 
    text: "Contact", 
    href: "/contacts" 
  },
];

const QuickLink: React.FC = () => {
  return (
    <nav className="flex flex-col w-60 text-neutral-600 max-md:max-w-full max-sm:mb-5">
      <h2 className="mb-5 text-xl font-bold">
        Quick Link
      </h2>
      <ul className="flex flex-col gap-1.5 text-sm font-semibold leading-5">
        {quickLinks.map((link, index) => (
          <li
            key={index}
            className="box-border flex relative flex-col shrink-0"
          >
            <Link href={link.href} className="hover:text-red-500">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuickLink;
