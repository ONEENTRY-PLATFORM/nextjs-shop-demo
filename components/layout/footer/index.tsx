import type { FC } from 'react';

import FooterMenuSection from './FooterMenu';

const { COMPANY_NAME, SITE_NAME } = process.env;

const Footer: FC<{ lang: string }> = async ({ lang }) => {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="w-full">
      <FooterMenuSection lang={lang} />
      <div className="w-full bg-black px-5 py-11 text-center text-white max-md:max-w-full max-md:p-5">
        <div className="">
          &copy; {copyrightDate} {SITE_NAME}, by{' '}
          <span className="text-orange-500">{COMPANY_NAME}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
