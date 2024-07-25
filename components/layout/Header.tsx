import React from 'react';
import SearchBar from './navbar/SearchBar';
import Logo from './navbar/Logo';

const Header: React.FC = () => {
  return (
    <header className="flex justify-center items-center px-5 bg-white border border-solid border-neutral-400 max-md:px-5">
      <section className="box-border flex flex-col grow justify-center self-stretch px-5 py-10 mx-auto w-full bg-white border border-solid border-neutral-400 max-w-[1200px] max-md:px-5">
        <div className="flex gap-6 justify-between w-full max-w-[1240px] max-md:flex-wrap">
          <Logo />
          <SearchBar />
          <nav className="flex gap-5 my-auto max-md:flex-wrap max-md:max-w-full">
            ICONS
          </nav>
        </div>
      </section>
    </header>
  );
};

export default Header;