import FooterMenuSection from './FooterMenu';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');

  return (
    <footer className="w-full">
      <FooterMenuSection logoSrc="/images/logo-250x70.svg" />
      <div className="w-full bg-black px-5 py-11 text-center text-white max-md:max-w-full max-md:px-5">
        <div className="">
          &copy; {copyrightDate} {SITE_NAME}, by{' '}
          <span className="text-orange-500">{COMPANY_NAME}</span>
        </div>
      </div>
    </footer>
  );
}
