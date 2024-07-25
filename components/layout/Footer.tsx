import React from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="text-center px-5 py-11 w-full bg-black text-white max-md:px-5 max-md:max-w-full">
      <div className=''>
        &copy; {copyrightDate} {SITE_NAME}, by <span className="text-orange-500">{COMPANY_NAME}</span>
      </div>
    </footer>
  );
}