import type { FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';

import FooterMenuSection from './FooterMenu';

const Footer: FC<{ lang: string }> = async ({ lang }) => {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const [dict] = useServerProvider('dict');

  return (
    <footer className="w-full">
      <FooterMenuSection lang={lang} />
      <div className="w-full bg-black px-5 py-11 text-center text-white max-md:max-w-full max-md:p-5">
        <div className="">
          &copy; {copyrightDate} {dict.site_name?.value}{' '}
          <span className="text-orange-500">{dict.company_name?.value}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
