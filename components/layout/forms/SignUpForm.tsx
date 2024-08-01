import React from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import ClosePopup from "./ClosePopup";

interface SignUpFormProps {
  sendSubmissionsTo: string;
  name: string;
  method: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  sendSubmissionsTo,
  name,
  method,
}) => {
  const formFields = [
    {
      label: "Your e-mail",
      type: "email",
      placeholder: "info@example.com",
      required: false,
      name: "f1",
    },
    {
      label: "Create password",
      type: "password",
      placeholder: "•••••",
      required: false,
      name: "f2",
    },
    {
      label: "Confirm password",
      type: "password",
      placeholder: "•••••",
      required: false,
      name: "f3",
    },
    {
      label: "First name",
      type: "text",
      placeholder: "ONE",
      required: false,
      name: "f4",
    },
    {
      label: "Surname",
      type: "text",
      placeholder: "ENTRY",
      required: false,
      name: "f5",
    },
  ];

  return (
    <div className="flex flex-col px-10 py-8 bg-white rounded-3xl border border-solid border-neutral-400 max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <main className="flex flex-col w-full min-h-[calc(100%_-_120px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          action={sendSubmissionsTo}
          name={name}
          method={method}
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5">
            <h1 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
              Sign up
            </h1>
            <p className="text-xs text-gray-400 max-md:max-w-full">
              Sign in or create account to quickly manage order
            </p>
          </div>
          <div className="box-border flex relative flex-col shrink-0 gap-4 mb-auto">
            {formFields.map((field, index) => (
              <FormInput key={index} {...field} />
            ))}
          </div>
          <FormSubmitButton text="SIGN UP" />
        </form>
      </main>
    </div>
  );
};

export default SignUpForm;
