/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

/**
 * StarRating.
 * @param   {object}      props          - Star rating props.
 * @param   {number}      props.value    - rating value.
 * @param   {any}         props.setValue - set rating value.
 * @param   {string}      props.type     - input type.
 * @param   {any}         props.field    - field.
 * @param   {boolean}     props.required - required.
 * @returns {JSX.Element}                StarRating component.
 */
const StarRating = ({
  value,
  setValue,
  type,
  field,
  required,
}: {
  value: string | number;
  setValue: any;
  type: string;
  field: any;
  required: boolean;
}): JSX.Element => {
  return (
    <div className="flex shrink-0 flex-row items-center gap-1.5 ">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className="my-auto aspect-square w-6.25 shrink-0 self-start cursor-pointer"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => setValue(index + 1)}
          onClick={() => setValue(index + 1)}
        >
          {/** Star shape path with dynamic fill/stroke based on rating */}
          <path
            d="M16.4697 0.845703C16.6194 0.385048 17.2712 0.385048 17.4209 0.845703L20.7354 11.0469C20.9362 11.6649 21.5123 12.083 22.1621 12.083H32.8887C33.373 12.083 33.5745 12.7036 33.1826 12.9883L24.5049 19.293C23.9792 19.6749 23.7592 20.3517 23.96 20.9697L27.2744 31.1719C27.4237 31.6324 26.8966 32.0151 26.5049 31.7305L17.8271 25.4258C17.3014 25.0438 16.5892 25.0438 16.0635 25.4258L7.38574 31.7305C6.99399 32.0151 6.46693 31.6324 6.61621 31.1719L9.93066 20.9697C10.1315 20.3517 9.91146 19.6749 9.38574 19.293L0.708008 12.9883C0.316151 12.7036 0.517591 12.083 1.00195 12.083H11.7285C12.3783 12.083 12.9545 11.6649 13.1553 11.0469L16.4697 0.845703Z"
            stroke={Number(value) <= index ? '#EC722B' : ''}
            fill={Number(value) > index ? '#EC722B' : ''}
          />
        </svg>
      ))}
      <input
        type={type}
        id={field.marker}
        className="hidden"
        required={required}
        onChange={(val) => setValue(val.currentTarget.value)}
        value={value}
      />
    </div>
  );
};

export default StarRating;
