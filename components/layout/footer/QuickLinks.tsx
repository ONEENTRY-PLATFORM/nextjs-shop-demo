import React from "react";

interface LinkItem {
  text: string;
  href: string;
}

const quickLinks: LinkItem[] = [
  { text: "About us", href: "#" },
  { text: "Service", href: "#" },
  { text: "Treatment", href: "#" },
  { text: "Product", href: "#" },
  { text: "Our experts", href: "#" },
  { text: "Support", href: "#" },
  { text: "Contact", href: "#" },
];

const QuickLink: React.FC = () => {
  return (
    <nav className="flex flex-col w-60 text-neutral-600 max-md:max-w-full max-sm:mb-5">
      <h2 className="mb-5 text-xl font-bold">Quick Link</h2>
      <ul className="flex flex-col gap-1.5 text-sm font-semibold leading-5">
        {quickLinks.map((link, index) => (
          <li
            key={index}
            className="box-border flex relative flex-col shrink-0"
          >
            <a className="hover:text-red-500" href={link.href}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuickLink;
