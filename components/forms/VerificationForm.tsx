import React from 'react';

import FormSubmitButton from './inputs/FormSubmitButton';
import OTPInputs from './inputs/OTPInputs';

const VerificationForm: React.FC = () => {
  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative mb-5 box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Verification
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Enter your OTP code here
        </p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-6">
        <OTPInputs inputCount={6} />

        <div className="-mt-px self-end text-xs text-orange-500 max-md:mr-2.5">
          <span className="text-gray-400">Did not receive the OTP? </span>
          <button className="font-bold text-orange-500" type="button">
            RESEND
          </button>
        </div>
      </div>

      <FormSubmitButton title="Verify now" class="" icon="" />
    </form>
  );
};

export default VerificationForm;
