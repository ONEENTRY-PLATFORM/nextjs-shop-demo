import React from 'react';

import SearchInput from './SearchInput';

const SearchBar: React.FC = () => {
  return (
    <div className="my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <SearchInput />
    </div>
  );
};

export default SearchBar;
