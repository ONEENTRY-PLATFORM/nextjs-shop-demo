import React from 'react';

const contactInfo = {
  title: 'Contact Info',
  address_title: 'Address',
  address: 'Dubai',
  phone_title: 'Phone',
  phone_1: '+9100006789101',
  phone_2: '+9100006789101',
  web_title: 'Web',
  email_1: 'info@oneentry.com',
  email_2: 'oneentry@gmail.com',
};

const ContactInfo: React.FC = async () => {
  const {
    title,
    address_title,
    address,
    phone_title,
    phone_1,
    phone_2,
    web_title,
    email_1,
    email_2,
  } = contactInfo;
  return (
    <nav className="flex max-w-[240px] grow flex-col font-bold text-neutral-600 max-sm:mb-5">
      <h2 className="mb-5 text-xl">{title}</h2>
      <div className="flex flex-col gap-1.5 whitespace-nowrap text-sm leading-5">
        <div className="mr-auto text-orange-500">{address_title}</div>
        <div className="mr-auto font-semibold">{address}</div>
        <div className="mr-auto text-orange-500">{phone_title}</div>
        <a href={'tel:' + { phone_1 }} className="relative box-border">
          {phone_1}
        </a>
        <a href={'tel:' + { phone_2 }} className="relative box-border">
          {phone_2}
        </a>
        <div className="mr-auto text-orange-500">{web_title}</div>
        <a href={'mailto:' + email_1} className="relative box-border">
          {email_1}
        </a>
        <a href={'mailto:' + email_2} className="relative box-border">
          {email_2}
        </a>
      </div>
    </nav>
  );
};

export default ContactInfo;
