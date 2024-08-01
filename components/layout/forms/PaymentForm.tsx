import React from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import ClosePopup from "./ClosePopup";

interface CardPaymentFormProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
  name: string;
  contentType: string;
  method: string;
  previewState: string;
}

const formFields = [];

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  sendSubmissionsTo,
  name,
  contentType,
  method,
}) => {
  return (
    <section className="flex flex-col px-10 pt-8 pb-16 bg-white rounded-3xl max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-12">
        <ClosePopup />
      </header>
      <main className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          action={sendSubmissionsTo}
          name={name}
          encType={contentType}
          method={method}
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
        >
          <img
            loading="lazy"
            src=""
            alt=""
            className="self-center mb-12 w-full aspect-[1.61] max-w-[375px] max-md:mt-10"
          />
          <div className="box-border flex relative flex-col shrink-0 gap-5 mb-16">
            <FormInput
              label="Card holder name"
              placeholder="ONEENTRY"
              name="cardHolderName"
              type="text"
              required={false}
            />
            <FormInput
              label="Card number"
              placeholder="2300 0000 0000 0000"
              name="cardNumber"
              type="text"
              required={false}
            />
            <div className="box-border flex relative flex-row shrink-0 justify-between">
              <FormInput 
                label="MM/YY" 
                placeholder="09/32" 
                name="expiryDate"
                type="text"
                required={false} 
              />
              <FormInput 
                label="CVC" 
                placeholder="xxx" 
                name="cvc"
                type="text"
                required={false} 
              />
            </div>
          </div>
          <FormSubmitButton text="CH" />
        </form>
      </main>
    </section>
  );
};

export default CardPaymentForm;
