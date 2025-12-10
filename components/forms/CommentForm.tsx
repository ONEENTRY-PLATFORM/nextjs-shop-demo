/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FormEvent, JSX } from 'react';
import { useState } from 'react';

import { api } from '@/app/api';

import ArrowUpIcon from '../icons/arrow-up';
import ErrorMessage from './inputs/ErrorMessage';

/**
 * Comment form
 * @param   {object}          props         - Props
 * @param   {object}          props.review  - Review
 * @param   {IProductsEntity} props.product - Product
 * @returns {JSX.Element}                   Comment form
 */
const CommentForm = ({
  review,
  product,
}: {
  review: any;
  product: IProductsEntity;
}): JSX.Element => {
  // const { authenticate } = useContext(AuthContext);
  const [value, setValue] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [response, setResponse] = useState<any>(null);

  /**
   * Submit comment
   * @param   {FormEvent<HTMLFormElement>} e - Form event
   * @returns {Promise<void>}                void
   */
  const onSubmitComment = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    /** Use first module form config of product */
    const moduleFormConfig = product?.moduleFormConfigs?.[0] || {};
    /** Send transformed form data to OneEntry API */
    try {
      setLoading(true);
      const res = await api.FormData.postFormsData({
        formIdentifier:
          moduleFormConfig?.formIdentifier || 'comment_to_product',
        formData: [
          {
            marker: 'comment_description',
            type: 'string',
            value: value,
          },
        ],
        formModuleConfigId: moduleFormConfig?.id || 5,
        moduleEntityIdentifier: product.id.toString(),
        replayTo: review.id.toString(), // review id for answer
        status: 'approved',
      });
      setLoading(false);
      setResponse(res);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };

  return (
    <form
      className="w-full flex gap-4 mt-4 flex-col"
      onSubmit={(e) => {
        if (!value) {
          return;
        }
        onSubmitComment(e);
      }}
    >
      <div className="flex w-full gap-4">
        <input
          type="text"
          name="review_id"
          placeholder="Your comment to the review"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-solid border-gray-300 p-2 w-full rounded-full"
        />
        <button
          type="submit"
          className="rounded-full cursor-pointer group"
          disabled={loading || !value}
          title="Submit review"
        >
          <ArrowUpIcon />
        </button>
      </div>
      {/* Error message */}
      {error && <ErrorMessage error={error} />}
      <div className="w-full text-center">{response?.actionMessage}</div>
    </form>
  );
};

export default CommentForm;
