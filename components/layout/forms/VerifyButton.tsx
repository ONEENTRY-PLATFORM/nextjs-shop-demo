import React from 'react';

const VerifyButton: React.FC = () => {
  return (
    <button
      type="submit"
      className="flex justify-center items-center self-center p-4 mt-auto w-80 max-w-full text-base font-bold text-white uppercase bg-orange-500 border border-none border-[black] rounded-[30px] max-md:px-5 max-md:mt-10"
    >
      Verify NOW
    </button>
  );
}

export default VerifyButton;