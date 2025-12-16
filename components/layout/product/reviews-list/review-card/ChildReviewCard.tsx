/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type JSX, useState } from 'react';

import CommentForm from '@/components/forms/CommentForm';

import RatingBlock from '../LikesBlock';
import AnswerButton from './AnswerButton';
import ChildReviews from './ChildReviews';

/**
 * Child review
 * @param   {object}           props            - Child review props
 * @param   {IAttributeValues} props.dict       - Dictionary
 * @param   {IProductsEntity}  props.product    - Product
 * @param   {object}           props.review     - Review
 * @param   {any[]}            props.allReviews - All reviews for recursive lookup
 * @returns {JSX.Element}                       Child review
 */
const ChildReviewCard = ({
  dict,
  product,
  review,
  allReviews = [],
}: {
  dict: IAttributeValues;
  product: IProductsEntity;
  review: any;
  allReviews?: any[];
}): JSX.Element => {
  const [state, setState] = useState(false);

  /** formData */
  const childFormData = review.formData;
  /** User name - can be from userIdentifier or from a form field */
  const userName = review.userIdentifier || 'Anonymous';
  /** Find content by marker - could be 'comment_description' or at index 2 */
  const contentField = childFormData?.find(
    (field: any) => field.marker === 'comment_description',
  );
  const content =
    contentField?.value ||
    childFormData?.find((field: any) => field.type === 'string')?.value ||
    childFormData?.[2]?.value ||
    '';
  /** Review date */
  const reviewDate = review.time
    ? new Date(review.time).toLocaleDateString('en-US')
    : '';
  /** Is user admin */
  const isUserAdmin = review.isUserAdmin;

  /** Find child reviews of this review (replies to this reply) */
  const nestedChildReviews = allReviews.filter(
    (r: any) => r.parentId == review.id && r.id !== review.id,
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          'flex gap-4 pl-10' +
          (isUserAdmin ? ' border-l border-orange-500' : '')
        }
      >
        <div className="flex flex-col gap-3 flex-1">
          {/** Review header with name and date */}
          <div className="flex items-center justify-between gap-4 text-neutral-600">
            <div className="flex items-center gap-2">
              {/* Admin avatar */}
              {isUserAdmin && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0H24V7.72429V8.08425V24H17.4306H17.104H4.30883H3.95577H0V0ZM0 0V24H3.95577C3.8238 23.9532 3.67082 23.9442 3.53238 23.9216C3.2096 23.869 2.91246 23.7195 2.64402 23.5368C2.09835 23.1655 1.68083 22.5431 1.5624 21.8905C1.5335 21.7313 1.51351 21.566 1.51063 21.4042C1.50302 20.9768 1.56632 20.5364 1.62964 20.1145C1.80107 18.9729 2.05235 17.8143 2.47752 16.7384C2.65601 16.2866 2.8913 15.8238 3.16807 15.4245C3.60522 14.7939 4.1931 14.2083 4.97559 14.0687C4.97435 13.4712 5.09639 12.8678 5.3841 12.3403C5.21167 12.1107 5.03508 11.8331 4.84889 11.622C4.66991 11.621 4.49355 11.6626 4.31217 11.658C3.72039 11.643 3.03618 11.3722 2.54325 11.0424C2.19653 10.8105 1.87649 10.5174 1.58888 10.2169C0.739876 9.32966 0.133425 7.89811 0.166059 6.66362C0.188804 5.80324 0.403944 5.18864 1.03584 4.58969C0.993124 4.52551 0.959099 4.45664 0.925313 4.38747C0.708945 3.93967 0.502007 3.48738 0.304636 3.03089C0.227654 2.85586 0.122466 2.67727 0.0795026 2.49047C0.0530056 2.37527 0.0568482 2.25936 0.0974139 2.1478C0.149994 2.0032 0.261462 1.85095 0.403311 1.78683C0.549082 1.72092 0.753682 1.73005 0.900492 1.7908C0.998575 1.83103 1.08385 1.89721 1.14717 1.98224C1.30172 2.18923 1.5007 2.69435 1.61278 2.94666C1.79821 3.36408 1.99213 3.77763 2.1693 4.19871C2.70482 4.24868 2.92732 4.2724 3.42268 4.51027C4.59188 5.0717 5.50866 6.38822 5.92418 7.5875C6.19816 8.37826 6.29705 9.33886 6.09548 10.1563C6.02947 10.4239 5.92983 10.6634 5.80964 10.9105C5.88108 10.9893 6.19411 11.4033 6.24946 11.4286C6.26421 11.4353 6.28056 11.4331 6.29556 11.428C6.36633 11.4038 6.44599 11.3462 6.51292 11.3102C6.66803 11.2269 6.82404 11.1467 6.98511 11.0754C8.92917 10.2154 11.7595 10.6394 13.7132 11.3009C13.8829 11.3584 14.0495 11.4274 14.2167 11.4919L14.711 9.49543C14.8888 8.79182 15.0757 8.09132 15.2419 7.38478C15.1526 7.21772 15.0724 7.05032 14.9944 6.87791C14.6206 6.04865 14.2555 5.21553 13.899 4.37866L13.5389 3.54811C13.4414 3.31923 13.3297 3.08658 13.2837 2.84059C13.2043 2.41624 13.2558 1.96098 13.4095 1.55905C13.6328 0.975505 14.1143 0.492056 14.6852 0.243379C15.2797 -0.0155604 15.8501 -0.0407859 16.4585 0.201775C16.9009 0.378149 17.2896 0.713209 17.5629 1.10064C17.7069 1.30482 17.7988 1.534 17.8982 1.76156C18.0113 2.01898 18.1218 2.27752 18.2298 2.53712L19.4211 5.38978C19.6287 5.41897 19.8493 5.40852 20.0586 5.41098L21.0806 5.42268C21.3455 5.42585 21.6155 5.42098 21.8784 5.45502C22.4081 5.52362 22.9184 5.7844 23.2939 6.16243C23.5867 6.45697 23.8113 6.85239 23.9145 7.25475C23.9324 7.32495 23.9537 7.39794 23.9536 7.47056C23.9686 7.553 23.9745 7.6451 24 7.72429V0H0ZM24 8.08425C23.985 8.13654 23.9741 8.18762 23.9648 8.2412C23.9284 8.54796 23.8314 8.84444 23.6796 9.11346C23.5277 9.38248 23.324 9.6187 23.0802 9.80842C22.2149 10.4878 21.4889 10.4193 20.4591 10.3203C20.0773 10.2836 19.6927 10.2546 19.3125 10.2032C19.2843 10.1992 19.2563 10.1941 19.2286 10.1877C19.1355 10.483 19.0669 10.7888 18.9896 11.0887L18.6298 12.4603C18.5075 12.9205 18.4229 13.3901 18.1732 13.8029C17.9933 14.1006 17.7168 14.3453 17.4142 14.513C17.6518 14.7284 17.8753 14.934 18.0761 15.1864C18.4241 15.624 18.6853 16.1102 18.906 16.6221C19.5526 18.1221 19.7579 19.729 19.8354 21.3471C19.8668 22.0025 19.6611 22.6233 19.2145 23.111C18.8916 23.4638 18.3962 23.7873 17.9288 23.9048C17.7725 23.9441 17.5751 23.9448 17.4306 24H24V8.08425ZM7.47425 16.3419C7.51944 16.8105 7.56432 17.2721 7.54972 17.7441C7.53953 18.0737 7.49516 18.4048 7.45249 18.7317C7.29925 19.9061 7.014 21.3047 6.51502 22.3813C6.18843 23.0859 5.67906 23.6667 4.90999 23.8908C4.73059 23.9429 4.46167 23.9409 4.31791 23.9963C4.31486 23.9974 4.31186 23.9987 4.30883 24H17.104C16.987 23.946 16.7502 23.9348 16.6139 23.9071C16.1209 23.8063 15.617 23.4942 15.2914 23.1132C15.0325 22.8103 14.8468 22.4585 14.6988 22.0902C14.51 21.6204 14.3918 21.133 14.2846 20.6394C14.0675 19.6409 13.9173 18.6034 13.9038 17.5804C13.8983 17.1605 13.9409 16.7427 13.9747 16.3248C13.4699 16.4934 12.9529 16.6232 12.4283 16.713C12.0742 16.7746 11.7169 16.8086 11.3589 16.8366C10.0875 16.9362 8.6445 16.9195 7.47425 16.3419ZM23.9536 7.47056C23.9425 7.60119 23.9537 7.73547 23.9555 7.86652C23.9571 7.99216 23.9479 8.1161 23.9648 8.2412C23.9741 8.18762 23.985 8.13654 24 8.08425V7.72429C23.9745 7.6451 23.9686 7.553 23.9536 7.47056Z"
                    fill="url(#paint0_linear_1135_3820)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1135_3820"
                      x1="12"
                      y1="0"
                      x2="12"
                      y2="24"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFDB0D" />
                      <stop offset="0.5" stopColor="#FF6B00" />
                      <stop offset="1" stopColor="#FF00BF" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              {/* User name */}
              <h3 className="text-lg font-bold">{userName}</h3>
            </div>
            {/** Review date */}
            {reviewDate && <time className="text-sm">{reviewDate}</time>}
          </div>

          {/** Review content */}
          <p className="text-sm leading-5 text-neutral-600">{content}</p>

          {/** Review actions */}
          <div className="flex items-center gap-4">
            {/** Leave answer */}
            <AnswerButton dict={dict} state={state} setState={setState} />

            {/** Like and dislike buttons */}
            <div className="flex items-center gap-4 ml-auto">
              <RatingBlock />
            </div>
          </div>

          {/* Comment form */}
          {state && (
            <CommentForm review={review} product={product} dict={dict} />
          )}
        </div>
      </div>

      {/* Recursively render nested child reviews (replies to this reply) */}
      {nestedChildReviews.length > 0 && (
        <ChildReviews
          dict={dict}
          product={product}
          childReviews={nestedChildReviews}
          allReviews={allReviews}
        />
      )}
    </div>
  );
};

export default ChildReviewCard;
