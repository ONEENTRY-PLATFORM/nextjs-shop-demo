import React from 'react';

const ContactInfo: React.FC = () => {
  return (
    <nav className="flex max-w-[240px] grow flex-col font-bold text-neutral-600 max-sm:mb-5">
      <h2 className="mb-5 text-xl">Contact Info</h2>
      <div className="flex flex-col gap-1.5 whitespace-nowrap text-sm leading-5">
        <div className="mr-auto text-orange-500">Address</div>
        <div className="mr-auto font-semibold">Dubai</div>
        <div className="mr-auto text-orange-500">Phone</div>
        <a href="tel:+9100006789101" className="relative box-border">
          +91(0000)5678910
        </a>
        <a href="tel:+9100006789101" className="relative box-border">
          +91(0000)6789101
        </a>
        <div className="mr-auto text-orange-500">Web</div>
        <a href="mailto:info@oneentry.com" className="relative box-border">
          info@oneentry.com
        </a>
        <a href="mailto:info@oneentry.com" className="relative box-border">
          oneentry@gmail.com
        </a>
      </div>
    </nav>
  );
};

export default ContactInfo;
