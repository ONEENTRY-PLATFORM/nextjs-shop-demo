import type { JSX } from 'react';

import FooterMenuSection from './components/FooterMenu';

/**
 * Footer section
 * @returns {JSX.Element} React component
 */
const Footer = (): JSX.Element => {
  return (
    <footer className="fade-in w-full max-xs:mb-[60px]">
      <FooterMenuSection />
    </footer>
  );
};

export default Footer;
