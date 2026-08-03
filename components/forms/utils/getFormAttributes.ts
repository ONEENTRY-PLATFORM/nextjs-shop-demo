import type {
  IFormAttribute,
  IFormsEntity,
} from 'oneentry/dist/forms/formsInterfaces';

/**
 * Normalizes a form's `attributes` payload to a plain array.
 *
 * `Forms.getFormByMarker` returns `attributes` as an array when the form has
 * fields; since SDK 1.0.158 the field-less form (the API sends `{}`) is
 * normalized to `[]` by the SDK itself. What is left for this utility is the
 * form that has not loaded yet (`undefined`) and the marker-keyed object form
 * the API may still respond with. Per the forms rule, this normalization lives
 * in a single utility used by every place that reads form fields.
 *
 * Always returns a new array, so callers may sort it in place.
 * @param   {IFormsEntity | undefined} form - Form entity from `getFormByMarker` (may be undefined while loading).
 * @returns {IFormAttribute[]}              Form attributes as an array (empty when the form has no fields).
 */
export const getFormAttributes = (
  form: IFormsEntity | undefined,
): IFormAttribute[] => {
  const attrs = form?.attributes as
    IFormAttribute[] | Record<string, IFormAttribute> | undefined;
  return Array.isArray(attrs) ? [...attrs] : Object.values(attrs ?? {});
};
