import React from "react";

const ContactInfo: React.FC = () => {
  return (
    <nav className="flex flex-col grow font-bold max-w-[240px] text-neutral-600 max-sm:mb-5">
      <h2 className="mb-5 text-xl">Contact Info</h2>
      <div className="flex flex-col gap-1.5 text-sm leading-5 whitespace-nowrap">
        <div className="mr-auto text-orange-500">Address</div>
        <div className="mr-auto font-semibold">Dubai</div>
        <div className="mr-auto text-orange-500">Phone</div>
        <a href="tel:+9100006789101" className="box-border relative">
          +91(0000)5678910
        </a>
        <a href="tel:+9100006789101" className="box-border relative">
          +91(0000)6789101
        </a>
        <div className="mr-auto text-orange-500">Web</div>
        <a href="mailto:info@oneentry.com" className="box-border relative">
          info@oneentry.com
        </a>
        <a href="mailto:info@oneentry.com" className="box-border relative">
          oneentry@gmail.com
        </a>
      </div>
    </nav>
  );
};

export default ContactInfo;
