import React from "react";
import PasswordInput from "./PasswordInput";

const ResetPasswordForm: React.FC = () => {
  return (
    <form className="flex flex-col gap-4 min-h-full text-xl leading-5">
      <div className="box-border flex relative flex-col shrink-0 gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Reset password
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Enter new password and confirm.
        </p>
      </div>
      <div className="box-border flex relative flex-col shrink-0 gap-4 mb-8">
        <PasswordInput label="New password" name="new-password" />
        <PasswordInput label="Confirm password" name="confirm-password" />
      </div>
      <button
        type="submit"
        className="flex justify-center items-center self-center p-4 mt-auto max-w-full text-base font-bold text-white uppercase bg-orange-500 border border-none border-[black] rounded-[30px] w-[282px] max-md:px-5 max-md:mt-10"
      >
        CHANGE PASSWORD
      </button>
    </form>
  );
};

export default ResetPasswordForm;
