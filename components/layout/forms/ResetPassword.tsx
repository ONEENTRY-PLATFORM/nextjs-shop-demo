import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import ClosePopup from "./ClosePopup";

const ResetPassword: React.FC = () => {
  return (
    <main className="flex flex-col px-10 pt-8 pb-16 bg-white rounded-3xl max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <ResetPasswordForm />
      </section>
    </main>
  );
};

export default ResetPassword;
