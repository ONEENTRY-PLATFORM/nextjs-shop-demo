import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type {
  IBodyPostFormData,
  IPostFormResponse,
} from 'oneentry/dist/forms-data/formsDataInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

// Re-export OneEntry types for convenience
export type { IBodyPostFormData, IPostFormResponse };

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

/**
 * Comment form data structure
 */
export interface CommentFormData {
  marker: string;
  type: 'string';
  value: string;
}

/**
 * Comment submission payload
 */
export interface CommentSubmitPayload extends IBodyPostFormData {
  formIdentifier: string;
  formData: CommentFormData[];
  formModuleConfigId: number;
  moduleEntityIdentifier: string;
  replayTo: string;
  status: string;
}
