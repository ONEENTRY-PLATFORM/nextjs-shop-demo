import type {
  IFormAttribute,
  IFormsEntity,
} from 'oneentry/dist/forms/formsInterfaces';

/**
 * Normalizes a form's `attributes` payload to a plain array.
 *
 * `Forms.getFormByMarker` returns `attributes` as an array when the form has
 * fields, but as an object (`{}` or marker-keyed) when it has none or when the
 * API responds in object form — so array methods cannot be called on it
 * directly. Per the forms rule, this normalization lives in a single utility
 * used by every place that reads form fields.
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
