import React from 'react';

import BackButton from './breadcrumbs/BackButton';
import BreadcrumbsTrail from './breadcrumbs/BreadcrumbsTrail';

const breadcrumbItems = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'Catalogue',
    href: '/catalogue',
  },
  {
    text: 'Soft toys',
    href: '/catalogue/soft-toys/',
  },
  {
    text: 'Grey Ninja',
    href: '/catalogue/soft-toys/grey-ninja',
  },
];

const Breadcrumbs: React.FC = () => (
  <section
    className="
      mx-auto box-border flex w-full 
      grow flex-col 
      justify-center self-stretch border 
      border-solid 
      border-neutral-100 
      bg-white px-5 py-2
    "
  >
    <div
      className="
      mx-auto flex w-full 
      max-w-[1240px] flex-col justify-center 
    "
    >
      <div className="mr-auto flex gap-5">
        <BackButton />
        <BreadcrumbsTrail items={breadcrumbItems} />
      </div>
    </div>
  </section>
);

export default Breadcrumbs;
