'use client';

import dynamic from 'next/dynamic';
import type { IAttributeValues } from 'oneentry/types';
import type { ComponentType } from 'react';

/**
 * Props every modal form receives from the forms modal.
 * @property {string}           className - Extra classes for the form root.
 * @property {string}           lang      - Current language shortcode.
 * @property {IAttributeValues} dict      - Dictionary data for labels and messages.
 */
export interface ModalFormProps {
  className: string;
  lang: string;
  dict: IAttributeValues;
}

/**
 * Chunk loaders of the modal's forms, keyed by the name the drawer context
 * sets. The import paths are static literals — a computed path cannot be
 * code-split.
 */
const formLoaders: Record<
  string,
  () => Promise<{ default: ComponentType<ModalFormProps> }>
> = {
  CalendarForm: () => import('@/components/forms/CalendarForm'),
  ContactUsForm: () => import('@/components/forms/ContactUsForm'),
  ForgotPasswordForm: () => import('@/components/forms/ForgotPasswordForm'),
  ResetPasswordForm: () => import('@/components/forms/ResetPasswordForm'),
  ReviewForm: () => import('@/components/forms/ReviewForm'),
  ReviewModal: () =>
    import('@/components/layout/product/reviews-list/review-modal/ReviewModal'),
  SignInForm: () => import('@/components/forms/SignInForm'),
  SignUpForm: () => import('@/components/forms/SignUpForm'),
  UserForm: () => import('@/components/forms/UserForm'),
  VerificationForm: () => import('@/components/forms/VerificationForm'),
};

/**
 * Lazy registry of the modal's form components.
 *
 * The modal used to pull the forms through a barrel (`import * as forms`),
 * which bundled all ten of them — plus their SDK calls, validators and
 * animations — into the initial JS of every page, even though at most one is
 * ever rendered and only after the user opens the drawer. Each entry is now a
 * `dynamic()` binding with its own chunk, loaded on demand (performance and
 * performance-popups rules). `ssr: false` matches the previous behaviour: the
 * modal is client-only and never rendered during SSR.
 */
export const formRegistry: Record<
  string,
  ComponentType<ModalFormProps>
> = Object.fromEntries(
  Object.entries(formLoaders).map(([name, load]) => [
    name,
    dynamic(load, { ssr: false }),
  ]),
);

/**
 * prefetchModalForm — warm a form's chunk before the user opens the modal.
 *
 * Call from `onPointerEnter` / `onFocus` of a trigger so the download happens
 * during the hover instead of after the click. Safe to call repeatedly: the
 * bundler resolves each chunk once and later calls hit the module cache.
 * @param {string} component - Registry key of the form to warm.
 */
export const prefetchModalForm = (component: string): void => {
  void formLoaders[component]?.().catch(() => {});
};
