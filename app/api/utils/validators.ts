/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable jsdoc/reject-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { compileRegex } from './compileRegex';

/**
 * Validators interface
 * @property {Function} requiredValidator         - Validates if a field is required
 * @property {Function} emailInspectionValidator  - Validates email format
 * @property {Function} fieldMaskValidator        - Validates field against a mask
 * @property {Function} stringInspectionValidator - Validates string length
 * @property {Function} correctPasswordValidator  - Validates password confirmation
 */
export type Validators = {
  requiredValidator: (value: string, validator: any) => boolean;
  emailInspectionValidator: (value: string, validator: any) => boolean;
  fieldMaskValidator: (value: string, validator: any) => boolean;
  stringInspectionValidator: (value: string, validator: any) => boolean;
  correctPasswordValidator: (value: string, validator: any) => boolean;
};

/**
 * Collection of form field validators
 */
export const validators: Validators = {
  requiredValidator: (value: string) => {
    return !!value.length;
  },
  /**
   * Validates email format
   * @param   {string}  value - Email value to validate
   * @returns {boolean}       True if email is valid, false otherwise
   */
  emailInspectionValidator: (value: string): boolean => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{1,7}$/;
    return emailRegex.test(value);
  },
  /**
   * Validates field against a mask
   * @param   {string}  value - Field value to validate
   * @param   {any}     mask  - Mask to validate against
   * @returns {boolean}       True if field is valid, false otherwise
   */
  fieldMaskValidator: (value: string, mask: any): boolean => {
    const regex = compileRegex(mask?.maskValue);
    return regex.test(value);
  },
  /**
   * Validates string length
   * @param   {string}           value     - String value to validate
   * @param   {Record<any, any>} validator - Validator object
   * @returns {boolean}                    True if string is valid, false otherwise
   */
  stringInspectionValidator: (
    value: string,
    validator: Record<any, any>,
  ): boolean => {
    if (validator.stringLength > 0 && value.length === validator.stringLength) {
      return true;
    }
    if (
      value.length <= +validator.stringMax &&
      value.length >= +validator.stringMin
    ) {
      return true;
    }
    return false;
  },
  /**
   * Validates password confirmation
   * @param   {string}  value       - Password value to validate
   * @param   {any}     repeatValue - Repeat password value to validate
   * @returns {boolean}             True if passwords match, false otherwise
   */
  correctPasswordValidator: (value: string, repeatValue: any): boolean => {
    return value === repeatValue;
  },
};
