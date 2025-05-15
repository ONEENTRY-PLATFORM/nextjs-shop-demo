import type { FC } from 'react';

import FooterMenuSection from './components/FooterMenu';
import OEMenuSection from './components/OE_MenuSection';

/**
 * Footer section
 *
 * @returns React component
 */
const Footer: FC = () => {
  return (
    <footer className="fade-in w-full max-xs:mb-[60px]">
      <FooterMenuSection />
      <OEMenuSection />
    </footer>
  );
};

export default Footer;
