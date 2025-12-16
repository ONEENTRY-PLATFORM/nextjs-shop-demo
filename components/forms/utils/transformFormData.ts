import type { FormDataType } from 'oneentry/dist/forms-data/formsDataInterfaces';

// Parameters for transforming a single field
export interface TransformFieldParams {
  marker: string;
  type: string;
  value: unknown;
  productId: number;
}

/**
 * Field transformer function type
 * Takes marker, value, and productId, returns transformed FormDataType
 */
type FieldTransformer = (
  marker: string,
  value: unknown,
  productId: number,
) => FormDataType;

/**
 * Map of field transformers by marker or type
 * Each transformer handles a specific field type/marker
 */
const FIELD_TRANSFORMERS: Record<string, FieldTransformer> = {
  spam: (marker) => ({
    marker,
    type: 'spam',
    value: '',
  }),
  send: (marker) => ({
    marker,
    type: 'button',
    value: '',
  }),
  text: (marker, value) => ({
    marker,
    type: 'text',
    value: [
      {
        plainValue: value,
      },
    ],
  }),
  groupOfImages: (marker, value, productId) => ({
    marker,
    type: 'groupOfImages',
    value: value || [],
    fileQuery: {
      type: 'catalog',
      entity: 'editor',
      id: productId,
    },
  }),
};

/**
 * Transform a single form field based on its type or marker
 * @param   {TransformFieldParams} params           - Field parameters
 * @param   {string}               params.marker    - Field marker identifier
 * @param   {string}               params.type      - Field type
 * @param   {unknown}              params.value     - Field value
 * @param   {number}               params.productId - Product ID for file uploads
 * @returns {FormDataType}                          Transformed form field data
 */
export const transformFormField = ({
  marker,
  type,
  value,
  productId,
}: TransformFieldParams): FormDataType => {
  // Check if there's a marker-specific transformer first (higher priority)
  if (FIELD_TRANSFORMERS[marker]) {
    return FIELD_TRANSFORMERS[marker](marker, value, productId);
  }

  // Then check for type-specific transformer
  if (FIELD_TRANSFORMERS[type]) {
    return FIELD_TRANSFORMERS[type](marker, value, productId);
  }

  // Default case: return field data as-is with proper type
  return {
    marker,
    type: type as 'string' | 'number' | 'float',
    value: String(value || ''),
  };
};

/**
 * Validate required form fields
 * @param   {FormDataType[]}                       transformedData - Array of transformed form fields
 * @returns {{ isValid: boolean; error?: string }}                 Validation result with isValid flag and error message
 */
export const validateFormData = (
  transformedData: FormDataType[],
): { isValid: boolean; error?: string } => {
  // Check if there's at least some data
  if (transformedData.length === 0) {
    return {
      isValid: false,
      error: 'No form data to submit',
    };
  }

  // Find required fields (excluding spam and button types)
  const contentFields = transformedData.filter(
    (field) => field.type !== 'spam' && field.type !== 'button',
  );

  // Check if at least one content field has a value
  const hasContent = contentFields.some((field) => {
    const value = field.value;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '' && value !== null && value !== undefined;
  });

  if (!hasContent) {
    return {
      isValid: false,
      error: 'Please fill in at least one field',
    };
  }

  return { isValid: true };
};
