import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneEntry Shop",
  description: "OneEntry next-js shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}