import '@/app/styles/payment.css';

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { IMask, IMaskInput } from 'react-imask';

import FormSubmitButton from './inputs/FormSubmitButton';

const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('0000 0000 0000 0000');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('01/25');
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  const inputRef = useRef(null);
  console.log(inputRef.current);

  return (
    <form
      className="flex min-h-full flex-col gap-4 text-xl leading-5"
      onSubmit={onSubmit}
    >
      <div className="relative h-[230px] w-[350px] self-center">
        <Image
          width={375}
          height={233}
          loading="lazy"
          src="/images/card.svg"
          alt=""
          className="mb-12 aspect-[1.61] w-full max-w-[375px] self-center max-md:mt-10"
        />

        {/* Image */}
        <div className="absolute top-0 left-0 h-[230px] w-[350px] self-center">
          <div className="creditcard">
            <div className="front">
              <div id="ccsingle"></div>
              <svg
                version="1.1"
                id="cardfront"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 750 471"
              >
                <g id="Front">
                  <g id="CardBackground">
                    <g id="Page-1_1_">
                      <g id="amex_1_">
                        <path
                          id="Rectangle-1_1_"
                          className="lightcolor grey"
                          d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                                C0,17.9,17.9,0,40,0z"
                        />
                      </g>
                    </g>
                    <path
                      className="darkcolor greydark"
                      d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z"
                    />
                  </g>
                  <text
                    transform="matrix(1 0 0 1 60 325)"
                    id="svgnumber"
                    className="st2 st3 st4"
                  >
                    {cardNumber}
                  </text>
                  <text
                    transform="matrix(1 0 0 1 54.1064 428.1723)"
                    id="svgname"
                    className="st2 st5 st6"
                  >
                    {cardName || 'ONE ENTRY'}
                  </text>
                  <text
                    transform="matrix(1 0 0 1 54 375)"
                    className="st7 st5 st8"
                  >
                    CARD HOLDER
                  </text>
                  <text
                    transform="matrix(1 0 0 1 360 380)"
                    className="st7 st5 st8"
                  >
                    MONTH/YEAR
                  </text>
                  <text
                    transform="matrix(1 0 0 1 65.1054 241.5)"
                    className="st7 st5 st8"
                  >
                    card number
                  </text>
                  <g>
                    <text
                      transform="matrix(1 0 0 1 574.4219 433.8095)"
                      id="svgexpire"
                      className="st2 st5 st9"
                    >
                      {cardExp}
                    </text>
                    <text
                      transform="matrix(1 0 0 1 479.3848 417.0097)"
                      className="st2 st10 st11"
                    >
                      VALID
                    </text>
                    <text
                      transform="matrix(1 0 0 1 479.3848 435.6762)"
                      className="st2 st10 st11"
                    >
                      THRU
                    </text>
                    <polygon
                      className="st2"
                      points="554.5,421 540.4,414.2 540.4,427.9"
                    />
                  </g>
                </g>
                <g id="Back"></g>
              </svg>
            </div>

            <div className="back">
              <svg
                version="1.1"
                id="cardback"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 750 471"
              >
                <g id="Front">
                  <line className="st0" x1="35.3" y1="10.4" x2="36.7" y2="11" />
                </g>
                <g id="Back">
                  <g id="Page-1_2_">
                    <g id="amex_2_">
                      <path
                        id="Rectangle-1_2_"
                        className="darkcolor greydark"
                        d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                            C0,17.9,17.9,0,40,0z"
                      />
                    </g>
                  </g>
                  <rect y="61.6" className="st2" width="750" height="78" />
                  <g>
                    <path
                      className="st3"
                      d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
                        C707.1,246.4,704.4,249.1,701.1,249.1z"
                    />
                    <rect
                      x="42.9"
                      y="198.6"
                      className="st4"
                      width="664.1"
                      height="10.5"
                    />
                    <rect
                      x="42.9"
                      y="224.5"
                      className="st4"
                      width="664.1"
                      height="10.5"
                    />
                    <path
                      className="st5"
                      d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z"
                    />
                  </g>
                  <text
                    transform="matrix(1 0 0 1 621.999 227.2734)"
                    id="svgsecurity"
                    className="st6 st7"
                  >
                    985
                  </text>
                  <g className="st8">
                    <text
                      transform="matrix(1 0 0 1 518.083 280.0879)"
                      className="st9 st6 st10"
                    >
                      security code
                    </text>
                  </g>
                  <rect
                    x="58.1"
                    y="378.6"
                    className="st11"
                    width="375.5"
                    height="13.5"
                  />
                  <rect
                    x="58.1"
                    y="405.6"
                    className="st11"
                    width="421.7"
                    height="13.5"
                  />
                  <text
                    transform="matrix(1 0 0 1 59.5073 228.6099)"
                    id="svgnameback"
                    className="st12 st13"
                  >
                    John Doe
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
        {/* Image */}
      </div>

      <div className="relative mb-16 box-border flex shrink-0 flex-col gap-5">
        <div className="relative box-border flex shrink-0 flex-col">
          <label htmlFor="name" className="text-base text-gray-400">
            Name
          </label>
          <input
            id="name"
            maxLength={20}
            type="text"
            placeholder="ONE ENTRY"
            onChange={(e) => {
              setCardName(e.target.value);
            }}
            value={cardName}
            className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
          />
        </div>

        <div className="relative box-border flex shrink-0 flex-col">
          <label htmlFor="cardnumber" className="text-base text-gray-400">
            Card Number
          </label>
          <IMaskInput
            mask={'0000 0000 0000 0000'}
            radix="."
            value=""
            pattern="[0-9]*"
            unmask={true}
            id="cardnumber"
            inputMode="numeric"
            inputRef={inputRef}
            onAccept={(value, mask) => {
              // setCardNumber(value);
            }}
            placeholder="Enter card number"
            className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
          />
        </div>

        <div className="relative box-border flex shrink-0 flex-row justify-between gap-4">
          <div className="relative box-border flex w-[45%] shrink-0 flex-col">
            <label htmlFor="expirationdate" className="text-base text-gray-400">
              Expiration (mm/yy)
            </label>
            <IMaskInput
              mask={Date}
              pattern="MM{/}YY"
              blocks={{
                MM: {
                  mask: IMask.MaskedRange,
                  from: 1,
                  to: 12,
                  maxLength: 2,
                },
                YY: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 999,
                  maxLength: 2,
                },
              }}
              placeholder="00/00"
              id="expirationdate"
              type="text"
              inputMode="numeric"
              onAccept={(value) => setCardExp(value)}
              className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
            />
          </div>
          <div className="relative box-border flex w-[45%] shrink-0 flex-col">
            <label htmlFor="securitycode" className="text-base text-gray-400">
              Security Code
            </label>
            <IMaskInput
              mask="0000"
              id="securitycode"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="000"
              className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5"
            />
          </div>
        </div>
      </div>

      <FormSubmitButton title="Apply" isLoading={false} class="" icon="CH" />
    </form>
  );
};

export default PaymentForm;
