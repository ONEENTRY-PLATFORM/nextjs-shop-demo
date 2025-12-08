// ChildReviews.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX } from 'react';

import ChildReview from './ChildReview';

/**
 * Child reviews
 */
const ChildReviews = ({
  lang,
  product,
  childReviews = [],
}: {
  lang: any;
  product: any;
  childReviews?: any[];
}): JSX.Element => {
  return (
    <>
      {/* Display child reviews */}
      {childReviews.length > 0 && (
        <div className="mt-6 flex flex-col gap-6">
          {childReviews.map((childReview: any, index: number) => (
            <ChildReview
              key={childReview.id || index}
              lang={lang}
              product={product}
              review={childReview}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ChildReviews;
