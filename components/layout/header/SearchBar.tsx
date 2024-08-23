import React from 'react';

import SearchInput from './SearchInput';

const SearchBar: React.FC = () => {
  return (
    <form className="my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:max-w-full max-md:px-5">
      <SearchInput />
    </form>
  );
};

export default SearchBar;
