import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Breadcrumbs from '../components/layout/Breadcrumbs';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import NavigationMenu from '../components/layout/navbar/NavigationMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OneEntry Shop',
  description: 'OneEntry next-js shop',
};

const navigationItems = [
  {
    label: 'Category',
    href: '/',
    hasDropdown: true,
  },
  {
    label: 'Promotion',
    href: '/promotion',
  },
  {
    label: 'New arrival',
    href: '/arrival',
  },
  {
    label: 'BEST SELLERS',
    href: '/best-sellers',
  },
  {
    label: 'OFFER OF TODAY',
    href: '/offers',
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const store = setupStore();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <NavigationMenu items={navigationItems} />
        <Breadcrumbs />
        {children}
        <Footer />
      </body>
    </html>
  );
}
