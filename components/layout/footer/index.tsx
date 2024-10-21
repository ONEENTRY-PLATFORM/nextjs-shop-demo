import type { FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';

import FooterMenuSection from './FooterMenu';

const Footer: FC = () => {
  const [dict] = useServerProvider('dict');

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="w-full max-xs:mb-[60px]">
      <FooterMenuSection />
      <div className="w-full bg-black px-5 py-11 text-center text-white max-md:max-w-full max-md:p-5">
        <div className="">
          &copy; {copyrightDate} {dict?.site_name?.value}{' '}
          <span className="text-orange-500">{dict?.company_name?.value}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
