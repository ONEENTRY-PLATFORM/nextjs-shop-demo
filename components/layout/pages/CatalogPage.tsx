import React from 'react';

import GridLayout from '../catalog/GridLayout';

const CatalogPage: React.FC = () => {
  return (
    <section className="relative mx-auto box-border flex w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <GridLayout items={[]} />
      </div>
    </section>
  );
};

export default CatalogPage;
