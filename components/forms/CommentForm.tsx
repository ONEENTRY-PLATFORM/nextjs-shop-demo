import { useParams } from 'next/navigation';
import type { IAttributeValues, IError } from 'oneentry/dist/base/utils';
import type {
  IFormByMarkerDataEntity,
  IPostFormResponse,
} from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { ChangeEvent, FormEvent, JSX } from 'react';
import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useFormsData, useGetFormByMarkerQuery } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

import ArrowUpIcon from '../icons/arrow-up';
import AuthError from '../pages/AuthError';
import ErrorMessage from './inputs/ErrorMessage';
import { getFormAttributes } from './utils/getFormAttributes';

/**
 * CommentForm component props
 * @property {IAttributeValues}        dict    - Dictionary object containing localized strings for UI text
 * @property {IFormByMarkerDataEntity} review  - Review being replied to (the SDK FormsData entity; only `id` is used)
 * @property {IProductsEntity}         product - Product entity containing product details and form configuration
 */
export interface CommentFormProps {
  /** Dictionary for localized text strings */
  dict: IAttributeValues;
  /** Review being replied to */
  review: IFormByMarkerDataEntity;
  /** Product entity with form configuration */
  product: IProductsEntity;
}

const FORM_MARKER = 'comment_to_product';
const COMMENT_MARKER = 'comment_description';
const FORM_STATUS = 'approved';

/**
 * Comment form for replying to product reviews
 * This component renders a form that allows authenticated users to submit comments
 * in reply to product reviews. It handles form validation, submission to the OneEntry API,
 * and displays success/error messages.
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

    /** Current locale from the route params — the form query must be locale-aware */
    const params = useParams();
    const lang = (params?.lang as string) || 'en';

    /**
     * Fetch the comment form configuration from the CMS — all submission
     * identifiers (formIdentifier, formModuleConfigId) and the comment field
     * definition come from this response, never from guessed literals.
     */
    const { data: formData } = useGetFormByMarkerQuery({
      marker: FORM_MARKER,
      lang,
    });

    /**
     * The comment field definition from the form attributes. Prefer the field
     * with the known marker; otherwise fall back to the first field, so the
     * marker and type always come from the CMS schema.
     */
    const commentField = useMemo(() => {
      const attributes = getFormAttributes(formData);
      return (
        attributes.find((attr) => attr.marker === COMMENT_MARKER) ||
        attributes[0]
      );
    }, [formData]);

    /** Use form submission hook for loading state and API calls */
    const { loading, sendData } = useFormsData();

    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [response, setResponse] = useState<IPostFormResponse | IError | null>(
      null,
    );

    const { form_error_text, submit_review_text, comment_placeholder } = dict;

    /**
     * Extract localized strings (memoized)
     */
    const buttonTitle = useMemo(
      () => submit_review_text?.value || 'Submit comment',
      [submit_review_text],
    );

    const placeholderText = useMemo(
      () => comment_placeholder?.value || 'Your comment to the review',
      [comment_placeholder],
    );

    /**
     * Memoized trimmed value check for button disabled state
     */
    const isValueEmpty = useMemo(() => !value.trim(), [value]);

    /**
     * Handle input change
     */
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      [],
    );

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

        /**
         * All identifiers must come from the getFormByMarker response — fail
         * gracefully instead of posting with guessed literals when the form
         * is not (yet) available from the CMS.
         */
        const moduleFormConfig = formData?.moduleFormConfigs?.[0];
        if (!formData?.identifier || !moduleFormConfig?.id || !commentField) {
          setError('Comment form is not available. Please try again later.');
          return;
        }

        try {
          const responseData = await sendData({
            formIdentifier: formData.identifier,
            formData: [
              {
                marker: commentField.marker,
                type: commentField.type,
                value: value.trim(),
              },
            ],
            formModuleConfigId: moduleFormConfig.id,
            moduleEntityIdentifier: product.id.toString(),
            replayTo: review.id.toString(),
            status: FORM_STATUS,
          });

          const typedResponse = responseData as IPostFormResponse | IError;
          setResponse(typedResponse);
          setValue(''); // Clear input on success

          // Show success toast
          if (
            typedResponse &&
            'actionMessage' in typedResponse &&
            typedResponse.actionMessage
          ) {
            toast.success(typedResponse.actionMessage);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to submit comment';
          setError(errorMessage);
        }
      },
      [value, product, review, formData, commentField, sendData],
    );

    /** Show authentication error if user is not logged in */
    if (!isAuth) {
      return <AuthError dict={dict} />;
    }

    /** Show error if product or review data is missing */
    if (!product || !review) {
      return (
        <>
          {(form_error_text?.value as string) || 'Error. Some data not found.'}
        </>
      );
    }

    return (
      <form
        className="mt-4 flex w-full flex-col gap-4"
        onSubmit={onSubmitComment}
      >
        <div className="flex w-full gap-4">
          <input
            type="text"
            name="comment_text"
            placeholder={placeholderText as string}
            value={value}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full rounded-full border border-solid border-gray-300 p-2 disabled:opacity-50"
          />
          <button
            type="submit"
            className="group cursor-pointer rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || isValueEmpty}
            title={buttonTitle as string}
            aria-label={buttonTitle as string}
          >
            <ArrowUpIcon />
          </button>
        </div>
        {/* Error message */}
        {error && <ErrorMessage error={error} />}
        {/* Success message */}
        {response &&
          'actionMessage' in response &&
          response.actionMessage &&
          !error && (
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
