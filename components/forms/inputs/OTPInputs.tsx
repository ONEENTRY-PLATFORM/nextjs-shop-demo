import React from 'react';

interface FormInputProps {
  inputCount: number;
}

const OTPInputs: React.FC<FormInputProps> = ({ inputCount }) => {
  return (
    <div className="flex justify-between gap-3.5 max-md:gap-2">
      {[...Array(inputCount)].map((_, index) => (
        <input
          key={index}
          type="text"
          placeholder=""
          defaultValue="0"
          name={`code-${index + 1}`}
          className="relative mx-auto box-border flex h-[70px] w-[60px] shrink-0 flex-col rounded border border-solid border-neutral-100 bg-neutral-100 p-2.5 text-center text-2xl font-medium text-neutral-600 max-md:w-[40px]"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInputs;
