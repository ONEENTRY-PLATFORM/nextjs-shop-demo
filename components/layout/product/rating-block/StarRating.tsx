import type { JSX } from 'react';

/**
 * StarRating.
 * @param   {object}      props        - Star rating props.
 * @param   {number}      props.rating - rating value.
 * @returns {JSX.Element}              StarRating component.
 */
const StarRating = ({ rating }: { rating: number }): JSX.Element => {
  return (
    <div className="flex shrink-0 flex-row items-center gap-1.5">
      {/** Render 5 stars, filling them based on the rating value */}
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className="my-auto aspect-square w-3.75 shrink-0 self-start"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/** Star shape path with dynamic fill/stroke based on rating */}
          <path
            d="M8.38585 1.08182L9.56768 4.71911C9.76849 5.33714 10.3444 5.75558 10.9943 5.75558H14.8187C15.3031 5.75558 15.5045 6.37539 15.1126 6.66009L12.0186 8.90806C11.4928 9.29002 11.2728 9.96707 11.4737 10.5851L12.6555 14.2224C12.8052 14.6831 12.2779 15.0661 11.8861 14.7814L8.792 12.5334C8.26627 12.1515 7.55438 12.1515 7.02865 12.5334L3.93459 14.7814C3.54273 15.0661 3.01549 14.683 3.16517 14.2224L4.34699 10.5851C4.5478 9.96707 4.32782 9.29002 3.80208 8.90806L0.708024 6.66009C0.316167 6.37539 0.517556 5.75558 1.00192 5.75558H4.82639C5.47622 5.75558 6.05216 5.33714 6.25297 4.71911L7.4348 1.08182C7.58447 0.621163 8.23618 0.621166 8.38585 1.08182Z"
            stroke={rating <= index ? '#EC722B' : ''}
            fill={rating > index ? '#EC722B' : ''}
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
