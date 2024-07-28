import React from 'react';
import OTPInputs from './inputs/OTPInputs';
import FormSubmitButton from './inputs/FormSubmitButton';
import ClosePopup from '../layout/popup/ClosePopup';

const VerificationForm: React.FC = () => {
  return (
    <div className="flex flex-col px-10 pt-8 pb-12 bg-white rounded-3xl border border-solid border-[black] max-w-[550px] w-[550px]">

      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>

      <main className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5 mb-5">
            <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
              Verification
            </h2>
            <p className="text-xs text-gray-400 max-md:max-w-full">
              Enter your OTP code here
            </p>
          </div>

          <div className="box-border flex relative flex-col shrink-0 gap-6 mb-8">

            <OTPInputs inputCount={6} />

            <div className="self-end -mt-px text-xs text-orange-500 max-md:mr-2.5">
              <span className="text-gray-400">
                Did not receive the OTP?
              </span>{" "}
              <button className="font-bold text-orange-500" type="button">
                RESEND
              </button>
            </div>
          </div>

          <FormSubmitButton 
            title='Verify NOW' 
            class='' 
            icon='' 
          />

        </form>
      </main>
    </div>
  );
};

export default VerificationForm;
