import type { JSX } from 'react';

import FooterMenuSection from './components/FooterMenu';

/**
 * Footer section component that serves as the main wrapper for the entire footer.
 * Renders the footer menu section with all footer content.
 * @returns {JSX.Element} React component
 */
const Footer = (): JSX.Element => {
  return (
    /**
     * Main footer element with fade-in animation and responsive bottom margin
     * Contains all footer content within a semantic footer tag
     */
    <footer className="fade-in w-full max-xs:mb-15">
      {/** Footer menu section containing all navigation menus and contact information. This component renders the main footer content including menus, logo, and contact info*/}
      <FooterMenuSection />
    </footer>
  );
};

export default Footer;
