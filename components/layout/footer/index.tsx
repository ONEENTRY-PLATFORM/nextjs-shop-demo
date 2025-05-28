import type { FC } from 'react';

import FooterMenuSection from './components/FooterMenu';

/**
 * Footer section
 *
 * @returns React component
 */
const Footer: FC = () => {
  return (
    <footer className="fade-in w-full max-xs:mb-[60px]">
      <FooterMenuSection />
    </footer>
  );
};

export default Footer;
