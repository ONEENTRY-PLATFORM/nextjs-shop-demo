import Link from 'next/link';
import React from 'react';

interface LinkItem {
  text: string;
  href: string;
}

const quickLinks: LinkItem[] = [
  {
    text: 'About us',
    href: '/about',
  },
  {
    text: 'Service',
    href: '/service',
  },
  {
    text: 'Treatment',
    href: '/treatment',
  },
  {
    text: 'Product',
    href: '/',
  },
  {
    text: 'Our experts',
    href: '/experts',
  },
  {
    text: 'Support',
    href: '/support',
  },
  {
    text: 'Contact',
    href: '/contacts',
  },
];

const QuickLink: React.FC = () => {
  return (
    <nav className="flex w-60 flex-col text-neutral-600 max-md:max-w-full max-sm:mb-5">
      <h2 className="mb-5 text-xl font-bold">Quick Link</h2>
      <ul className="flex flex-col gap-1.5 text-sm font-semibold leading-5">
        {quickLinks.map((link, index) => (
          <li
            key={index}
            className="relative box-border flex shrink-0 flex-col"
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
