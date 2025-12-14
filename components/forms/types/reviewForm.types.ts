import type {
  FormDataType,
  IBodyPostFormData,
  IPostFormResponse,
} from 'oneentry/dist/forms-data/formsDataInterfaces';

// Re-export OneEntry types for convenience
export type { FormDataType, IBodyPostFormData, IPostFormResponse };

// Extended response type for better type safety
export interface ReviewFormResponse extends IPostFormResponse {
  actionMessage: string;
}

// Parameters for transforming a single field
export interface TransformFieldParams {
  marker: string;
  type: string;
  value: unknown;
  productId: number;
}

// Field value from Redux store
export interface FieldValue {
  value?: unknown;
}

// Map of field values from Redux
export type FieldsDataMap = Record<string, FieldValue>;
