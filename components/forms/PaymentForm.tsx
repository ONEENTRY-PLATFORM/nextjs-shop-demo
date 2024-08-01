import React from "react";
import FormInput from "./inputs/FormInput";
import FormSubmitButton from "./inputs/FormSubmitButton";

const PaymentForm: React.FC = () => {
  return (
    <form className="flex flex-col gap-4 min-h-full text-xl leading-5">
          <img
            loading="lazy"
            src=""
            alt=""
            className="self-center mb-12 w-full aspect-[1.61] max-w-[375px] max-md:mt-10"
          />
          <div className="box-border flex relative flex-col shrink-0 gap-5 mb-16">
            <FormInput
              type="text"
              label="Card holder name"
              placeholder="ONEENTRY"
              name="cardHolderName"
              required={true}
            />
            <FormInput
              type="text"
              label="Card number"
              placeholder="2300 0000 0000 0000"
              name="cardNumber"
              required={true}
            />
            <div className="box-border flex relative flex-row shrink-0 justify-between">
              <FormInput
                type="text"
                label="MM/YY"
                placeholder="09/32"
                name="expiryDate"
                required={true}
              />
              <FormInput
                type="text"
                label="CVC"
                placeholder="xxx"
                name="cvc"
                required={true}
              />
            </div>
          </div>

          <FormSubmitButton title="Apply" class="" icon="CH" />
    </form>
  );
};

export default PaymentForm;
