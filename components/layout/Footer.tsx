import React from 'react';
import FooterMenu from './FooterMenu';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="w-full">
      <FooterMenu logoSrc={'./images/logo-250x70.svg'} />
      <div className='text-center px-5 py-11 w-full bg-black text-white max-md:px-5 max-md:max-w-full'>
        <div className=''>
          &copy; {copyrightDate} {SITE_NAME}, by <span className="text-orange-500">{COMPANY_NAME}</span>
        </div>
      </div>
    </footer>
  );
}