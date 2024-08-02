import Image from 'next/image';
import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <form className="my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:max-w-full max-md:px-5">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="search"
        id="search"
        placeholder="Search"
        name="search"
        className="h-auto w-full self-stretch border-none text-lg outline-none max-md:max-w-full max-md:px-5"
      />
      <button
        type="submit"
        className="relative m-auto box-border flex shrink-0 flex-col p-2.5"
      >
        <span className="sr-only">search</span>
        <Image
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          loading="lazy"
          src="/icons/search.svg"
          className="aspect-square w-6"
          alt=""
        />
      </button>
    </form>
  );
};

export default SearchBar;
