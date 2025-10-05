import type { JSX } from 'react';

/**
 * Rating bar.
 * @param   {object}      value          - rating value.
 * @param   {number}      value.value    - rating value.
 * @param   {string}      value.maxWidth - max width.
 * @returns {JSX.Element}                rating bar component.
 */
const RatingBar = ({
  value,
  maxWidth,
}: {
  value: number;
  maxWidth: string;
}): JSX.Element => (
  <div
    className="my-auto flex flex-col justify-center"
    style={{ width: maxWidth }}
  >
    <div className="flex flex-col justify-center rounded-md bg-neutral-100">
      <div
        className="h-2 shrink-0 rounded-md bg-yellow-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default RatingBar;
