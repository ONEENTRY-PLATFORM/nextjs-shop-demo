import React from 'react';
import OTPInput from './OTPInput';
import VerifyButton from './VerifyButton';
import ClosePopup from "./ClosePopup";

interface VerificationFormProps {
  sendSubmissionsTo: string;
  name: string;
  method: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  sendSubmissionsTo,
  name,
  method
}) => {
  return (
    <div className="flex flex-col px-10 pt-8 pb-12 bg-white rounded-3xl max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>

      <main className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          action={sendSubmissionsTo}
          name={name}
          method={method}
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5 mb-5">
            <h2 className="text-xl font-bold text-neutral-600 w-full">
              Verification
            </h2>
            <p className="text-xs text-gray-400 w-full">
              Enter your OTP code here
            </p>
          </div>
          <OTPInput />
          <VerifyButton />
        </form>
      </main>
      
    </div>
  );
}

export default VerificationForm;