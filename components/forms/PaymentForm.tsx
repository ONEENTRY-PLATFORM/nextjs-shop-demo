/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import '@/app/styles/payment.css';

import Image from 'next/image';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC, FormEvent } from 'react';
import { useRef, useState } from 'react';
import { IMask, IMaskInput } from 'react-imask';

import FormSubmitButton from './inputs/FormSubmitButton';

/**
 * PaymentForm
 * @param lang Current language shortcode
 * @param dict dictionary from server api
 *
 * @returns PaymentForm
 */
const PaymentForm: FC<{ lang: string; dict: IAttributeValues }> = ({
  lang,
  dict,
}) => {
  const inputRef = useRef(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('01/25');
  const [cardCode, setCardCode] = useState('000');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // !!!
  };

  return (
    <form
      className="mx-auto flex min-h-full max-w-[350px] flex-col gap-4 text-xl leading-5"
      onSubmit={onSubmit}
    >
      <div className="relative h-[230px] w-[350px] self-center">
        <Image
          width={350}
          height={230}
          loading="lazy"
          src="/images/card.svg"
          alt=""
          className="w-full max-w-[350px] self-center rounded-2xl shadow-xl"
        />
        {/* Image */}
        <div className="absolute left-0 top-0 h-[230px] w-[350px] self-center">
          <div className="creditcard">
            <div>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 750 471"
                id="cardfront"
                className="front"
              >
                <g id="Front">
                  <text
                    transform="matrix(1 0 0 1 50 325)"
                    id="svgnumber"
                    className="st2 st4"
                  >
                    {cardNumber || '0000 0000 0000 0000'}
                  </text>
                  <text
                    transform="matrix(1 0 0 1 54.1064 428.1723)"
                    id="svgname"
                    className="st2 st5 st6 uppercase"
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
                    transform="matrix(1 0 0 1 560 380)"
                    className="st7 st5 st8"
                  >
                    MONTH/YEAR
                  </text>
                  <g>
                    <text
                      transform="matrix(1 0 0 1 630 430)"
                      id="svgexpire"
                      className="st2 st5 st9"
                    >
                      {cardExp || '01/25'}
                    </text>
                    <text
                      transform="matrix(1 0 0 1 560 417.0097)"
                      className="st2 st10 st11"
                    >
                      VALID
                    </text>
                    <text
                      transform="matrix(1 0 0 1 560 435.6762)"
                      className="st2 st10 st11"
                    >
                      THRU
                    </text>
                  </g>
                </g>
              </svg>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 750 471"
                id="cardback"
                className="back"
              >
                <g id="Back">
                  <g id="Page-1_2_">
                    <g id="amex_2_">
                      <path
                        id="Rectangle-1_2_"
                        className="darkcolor greydark"
                        d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40 C0,17.9,17.9,0,40,0z"
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
                    {cardCode}
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
                    {cardName || 'ONE ENTRY'}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
        {/* Image */}
      </div>

      <div className="relative mb-16 box-border flex max-w-full shrink-0 flex-col gap-5 max-md:mb-6">
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
            className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          />
        </div>

        <div className="relative box-border flex shrink-0 flex-col">
          <label htmlFor="cardnumber" className="text-base text-gray-400">
            Card Number
          </label>
          <IMaskInput
            mask={'0000 0000 0000 0000'}
            radix="."
            value={cardNumber}
            pattern="[0-9]*"
            unmask={false}
            id="cardnumber"
            inputMode="numeric"
            inputRef={inputRef}
            onAccept={(value) => {
              setCardNumber(value);
            }}
            placeholder="Enter card number"
            className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
          />
        </div>

        <div className="relative box-border flex shrink-0 flex-row justify-between gap-4 max-md:flex-col">
          <div className="relative box-border flex w-full shrink-0 flex-col sm:w-[45%]">
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
              className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
            />
          </div>
          <div className="relative box-border flex w-full shrink-0 flex-col sm:w-[45%]">
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
              onAccept={(value) => setCardCode(value)}
              className="relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800"
            />
          </div>
        </div>
      </div>
      {/* !!! */}
      <FormSubmitButton title="Apply" isLoading={false} index={0} />
    </form>
  );
};

export default PaymentForm;
