import React from 'react';

import Logo from './header/Logo';
import NavGroup from './header/NavGroup';
import SearchBar from './header/SearchBar';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center border border-solid border-neutral-100 bg-white px-5 max-md:px-5">
      <section
        className="
          mx-auto box-border flex w-full 
          max-w-[1240px] grow 
          flex-col 
          justify-center
          self-stretch 
          bg-white 
          max-md:px-5 
          md:py-6 
          lg:py-10
        "
      >
        <div className="flex w-full max-w-[1240px] justify-between gap-6 max-md:flex-wrap">
          <Logo />
          <SearchBar />
          <NavGroup />
        </div>
      </section>
    </header>
  );
};

export default Header;
