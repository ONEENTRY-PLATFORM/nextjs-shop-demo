import type { IAttributeValues, IError } from 'oneentry/dist/base/utils';
import type { IPostFormResponse } from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FormEvent, JSX } from 'react';
import { memo, useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

import ArrowUpIcon from '../icons/arrow-up';
import AuthError from '../pages/AuthError';
import ErrorMessage from './inputs/ErrorMessage';

/**
 * Review data interface
 * Represents a product review that can be replied to
 * @property {number | string} id - Unique identifier of the review
 */
export interface ReviewData {
  id: number | string;
  [key: string]: unknown;
}

/**
 * CommentForm component props
 * @property {IAttributeValues} dict    - Dictionary object containing localized strings for UI text
 * @property {ReviewData}       review  - Review data object being replied to, contains the review ID
 * @property {IProductsEntity}  product - Product entity containing product details and form configuration
 */
export interface CommentFormProps {
  /** Dictionary for localized text strings */
  dict: IAttributeValues;
  /** Review being replied to */
  review: ReviewData;
  /** Product entity with form configuration */
  product: IProductsEntity;
}

const DEFAULT_MODULE_CONFIG_ID = 5;
const DEFAULT_FORM_IDENTIFIER = 'comment_to_product';
const COMMENT_MARKER = 'comment_description';
const FORM_STATUS = 'approved';

/**
 * Comment form for replying to product reviews
 * This component renders a form that allows authenticated users to submit comments
 * in reply to product reviews. It handles form validation, submission to the OneEntry API,
 * and displays success/error messages.
 * Features:
 * - Authentication check (shows AuthError if user is not logged in)
 * - Real-time validation (checks for empty comments)
 * - Toast notifications on successful submission
 * - Error handling with user-friendly messages
 * - Automatic form clearing on successful submission
 * - Loading states with disabled UI during submission
 * @param   {CommentFormProps} props         - Component props
 * @param   {object}           props.dict    - Dictionary with localized strings (submit_review_text, comment_placeholder)
 * @param   {object}           props.review  - Review being replied to (contains review.id for replyTo field)
 * @param   {object}           props.product - Product entity (contains moduleFormConfigs for API submission)
 * @returns {JSX.Element}                    Comment form component
 * @example
 * ```tsx
 * <CommentForm
 *   dict={localizationDict}
 *   review={{ id: 123 }}
 *   product={productEntity}
 * />
 * ```
 */
const CommentForm = memo(
  ({ dict, review, product }: CommentFormProps): JSX.Element => {
    /** Authentication context providing user authentication status and methods */
    const { isAuth } = useContext(AuthContext);

    const [value, setValue] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [response, setResponse] = useState<IPostFormResponse | IError | null>(
      null,
    );

    const { form_error_text, submit_review_text, comment_placeholder } = dict;

    /**
     * Submit comment
     * Sends comment data to the API and handles success/error states
     */
    const onSubmitComment = useCallback(
      async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        // Validate comment value
        if (!value.trim()) {
          setError('Comment cannot be empty');
          return;
        }

        try {
          setLoading(true);

          const moduleFormConfig = product?.moduleFormConfigs?.[0];

          const responseData = await api.FormData.postFormsData({
            formIdentifier:
              moduleFormConfig?.formIdentifier || DEFAULT_FORM_IDENTIFIER,
            formData: [
              {
                marker: COMMENT_MARKER,
                type: 'string',
                value: value.trim(),
              },
            ],
            formModuleConfigId:
              moduleFormConfig?.id || DEFAULT_MODULE_CONFIG_ID,
            moduleEntityIdentifier: product.id.toString(),
            replayTo: review.id.toString(),
            status: FORM_STATUS,
          });

          setResponse(responseData);
          setLoading(false);
          setValue(''); // Clear input on success

          // Show success toast
          if (responseData?.actionMessage) {
            toast.success(responseData.actionMessage);
          }
        } catch (err) {
          setLoading(false);
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to submit comment';
          setError(errorMessage);
        }
      },
      [value, product, review],
    );

    /** Show authentication error if user is not logged in */
    if (!isAuth) {
      return <AuthError dict={dict} />;
    }

    /** Show error if product or review data is missing */
    if (!product || !review) {
      return form_error_text?.value || 'Error. Some data not found.';
    }

    /** Extract localized strings for button title and placeholder text */
    const buttonTitle = submit_review_text?.value || 'Submit comment';
    const placeholderText =
      comment_placeholder?.value || 'Your comment to the review';

    return (
      <form
        className="w-full flex gap-4 mt-4 flex-col"
        onSubmit={onSubmitComment}
      >
        <div className="flex w-full gap-4">
          <input
            type="text"
            name="comment_text"
            placeholder={placeholderText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            className="border border-solid border-gray-300 p-2 w-full rounded-full disabled:opacity-50"
          />
          <button
            type="submit"
            className="rounded-full cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !value.trim()}
            title={buttonTitle}
            aria-label={buttonTitle}
          >
            <ArrowUpIcon />
          </button>
        </div>
        {/* Error message */}
        {error && <ErrorMessage error={error} />}
        {/* Success message */}
        {response?.actionMessage && !error && (
          <div className="w-full text-center text-green-600">
            {response.actionMessage}
          </div>
        )}
      </form>
    );
  },
);

CommentForm.displayName = 'CommentForm';

export default CommentForm;
