import React from 'react';
import OTPInput from './inputs/OTPInput';
import FormSubmitButton from './inputs/FormSubmitButton';

interface VerificationFormProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
  name: string;
  contentType: string;
  method: string;
  previewState: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  sendSubmissionsTo,
  sendSubmissionsToEmail,
  name,
  contentType,
  method,
  previewState
}) => {
  return (
    <div className="flex flex-col px-10 pt-8 pb-12 bg-white rounded-3xl border border-solid border-[black] max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <img loading="lazy" src="" className="self-end w-10 aspect-square max-md:mr-2.5" alt="" />
      </header>
      <main className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          name={name}
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
          method={method}
          action={sendSubmissionsTo === 'email' ? `mailto:${sendSubmissionsToEmail}` : undefined}
          encType={contentType}
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5 mb-5">
            <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">Verification</h2>
            <p className="text-xs text-gray-400 max-md:max-w-full">Enter your OTP code here</p>
          </div>
          <OTPInput />
          <FormSubmitButton text='Verify NOW' />
        </form>
      </main>
    </div>
  );
};

export default VerificationForm;
