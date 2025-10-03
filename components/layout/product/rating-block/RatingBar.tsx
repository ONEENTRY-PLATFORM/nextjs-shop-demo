import type { JSX } from 'react';

interface RatingBarProps {
  value: number;
  maxWidth: string;
}

/**
 * RatingBar.
 *
 * @param value - rating value.
 * @param maxWidth - max width.
 *
 * @returns RatingBar.
 */
const RatingBar = ({ value, maxWidth }: RatingBarProps): JSX.Element => (
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
