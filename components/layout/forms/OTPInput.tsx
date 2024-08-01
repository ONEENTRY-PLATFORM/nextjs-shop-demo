import React from 'react';

const OTPInput: React.FC = () => {
  const inputCount = 6;

  return (
    <div className="box-border flex relative flex-col shrink-0 gap-6 mb-8">
      <div className="flex gap-3.5 justify-between">
        {[...Array(inputCount)].map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder=""
            defaultValue="0"
            name={`code-${index + 1}`}
            className="box-border flex relative flex-col shrink-0 p-2.5 mx-auto text-2xl font-medium text-center rounded border border-solid bg-neutral-100 border-neutral-100 h-[70px] text-neutral-600 w-[60px]"
            required={false}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      <div className="self-end -mt-px text-xs text-orange-500 max-md:mr-2.5">
        <span className="text-gray-400">Did not receive the OTP?</span>{" "}
        <button className="font-bold text-orange-500 bg-transparent border-none cursor-pointer">RESEND</button>
      </div>
    </div>
  );
}

export default OTPInput;