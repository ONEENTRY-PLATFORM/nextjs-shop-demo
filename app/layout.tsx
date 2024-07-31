import type { Metadata } from "next";
import {Provider} from 'react-redux';
import {setupStore} from './store/store';

import Header from '../components/layout/Header';
import NavigationMenu from '../components/layout/navbar/NavigationMenu';
import Footer from '../components/layout/Footer';
import Breadcrumbs from '../components/layout/Breadcrumbs';

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneEntry Shop",
  description: "OneEntry next-js shop",
};

const navigationItems = [
  { 
    label: 'Category', 
    href: '/', 
    hasDropdown: true 
  },
  { 
    label: 'Promotion', 
    href: '/promotion' 
  },
  { 
    label: 'New arrival', 
    href: '/arrival' 
  },
  { 
    label: 'BEST SELLERS', 
    href: '/best-sellers' 
  },
  { 
    label: 'OFFER OF TODAY', 
    href: '/offers' 
  },
];

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {

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