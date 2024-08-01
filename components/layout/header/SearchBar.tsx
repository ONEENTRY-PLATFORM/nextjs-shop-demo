import React from "react";

const SearchBar: React.FC = () => {
  return (
    <form className="flex flex-row grow shrink-0 gap-5 justify-end items-center px-7 my-auto ml-24 bg-white border border-gray-400 border-solid basis-0 h-[60px] rounded-[30px] w-fit max-md:px-5 max-md:max-w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="search"
        id="search"
        placeholder="Search"
        name="search"
        className="self-stretch w-full h-auto text-lg border-none max-md:px-5 max-md:max-w-full"
      />
      <button
        type="submit"
        className="box-border flex relative flex-col shrink-0 p-2.5 m-auto"
      >
        <Image
          loading="lazy"
          src="/icons/search.svg"
          className="w-6 aspect-square"
          alt=""
        />
      </button>
    </form>
  );
};

export default SearchBar;
