import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from '../components/layout/Header';
import NavigationMenu from '../components/layout/navbar/NavigationMenu';
import Footer from '../components/layout/Footer';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneEntry Shop",
  description: "OneEntry next-js shop",
};

const navigationItems = [
  { 
    label: 'Category', 
    href: '#', 
    hasDropdown: true 
  },
  { 
    label: 'Promotion', 
    href: '#' 
  },
  { 
    label: 'New arrival', 
    href: '#' 
  },
  { 
    label: 'BEST SELLERS', 
    href: '#' 
  },
  { 
    label: 'OFFER OF TODAY', 
    href: '#' 
  },
];

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
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