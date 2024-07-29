import React from "react";

interface FormInputProps {
  inputCount: number;
}

const OTPInputs: React.FC<FormInputProps> = ({ inputCount }) => {
  return (
    <div className="flex gap-3.5 justify-between">
      {[...Array(inputCount)].map((_, index) => (
        <input
          key={index}
          type="text"
          placeholder=""
          defaultValue="0"
          name={`code-${index + 1}`}
          className="box-border flex relative flex-col shrink-0 p-2.5 mx-auto text-2xl font-medium text-center rounded border border-solid bg-neutral-100 border-neutral-100 h-[70px] text-neutral-600 w-[60px]"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInputs;
