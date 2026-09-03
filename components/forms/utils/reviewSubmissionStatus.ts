import type { IProductsEntity } from 'oneentry/types';

/**
 * Resolves the `status` a review/comment submission must carry.
 *
 * Premoderation is a per-config switch in the admin panel (`isModerate`), and
 * submitting `'approved'` regardless of it publishes straight to the storefront
 * — the moderation queue stays empty and the setting silently does nothing.
 * Verified against the live project: the reviews config answers
 * `isModerate: true`, so every review this app posted was bypassing it.
 *
 * `isModerate` is only present on configs delivered through the products/pages
 * API, not through `Forms.getFormByMarker` — which is why the flag has to come
 * off the product and be matched to the form's config by `id`.
 *
 * Falls back to `'approved'` when the flag is absent: an unmoderated form leaves
 * records in `sent`, and the reviews list filters for `'approved'`, so guessing
 * `'sent'` here would make submissions vanish instead of appearing.
 * @param   {IProductsEntity}     product        - Product the submission belongs to.
 * @param   {number}              moduleConfigId - Form module-config id used for the submission.
 * @returns {'sent' | 'approved'}                `'sent'` when the config is moderated, else `'approved'`.
 */
export const reviewSubmissionStatus = (
  product: IProductsEntity,
  moduleConfigId: number,
): 'sent' | 'approved' => {
  const configs = product.moduleFormConfigs;
  if (!Array.isArray(configs)) {
    return 'approved';
  }

  const config = configs.find((item) => item.id === moduleConfigId);
  return config?.isModerate === true ? 'sent' : 'approved';
};
