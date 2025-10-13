'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Reset password button component.
 * Provides a button that switches the current view to the forgot password form.
 * @param   {object}      props       - Props for the component.
 * @param   {string}      props.title - Button title text.
 * @returns {JSX.Element}             Reset password button component.
 */
const ResetPasswordButton = ({ title }: { title: string }): JSX.Element => {
  /**
   * Access the OpenDrawerContext to change the currently displayed component
   */
  const { setComponent } = useContext(OpenDrawerContext);

  return (
    /**
     * Button element for triggering the password reset flow
     * On click, switches the view to the ForgotPasswordForm component
     */
    <button
      onClick={() => {
        setComponent('ForgotPasswordForm');
      }}
      type="button"
      className="font-bold text-gray-400 underline hover:text-orange-500"
    >
      {title}
    </button>
  );
};

export default ResetPasswordButton;
