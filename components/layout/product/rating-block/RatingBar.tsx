import type { JSX } from 'react';

/**
 * Rating bar.
 * @param   {object}      props          - Component props
 * @param   {number}      props.value    - Rating value as percentage (0-100)
 * @param   {string}      props.maxWidth - Maximum width of the rating bar
 * @returns {JSX.Element}                Rating bar component
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
    {/** Background track for the rating bar */}
    <div className="flex flex-col justify-center rounded-md bg-neutral-100">
      {/** Foreground fill showing the rating percentage */}
      <div
        className="h-2 shrink-0 rounded-md bg-yellow-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default RatingBar;
