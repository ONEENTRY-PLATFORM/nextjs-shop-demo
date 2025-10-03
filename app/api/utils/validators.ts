/* eslint-disable @typescript-eslint/no-explicit-any */
import { compileRegex } from './compileRegex';

/**
 * Validators interface
 *
 * @property requiredValidator - Validates if a field is required
 * @property emailInspectionValidator - Validates email format
 * @property fieldMaskValidator - Validates field against a mask
 * @property stringInspectionValidator - Validates string length
 * @property correctPasswordValidator - Validates password confirmation
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
  emailInspectionValidator: (value: string) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{1,7}$/;
    return emailRegex.test(value);
  },
  fieldMaskValidator: (value: string, mask: any) => {
    const regex = compileRegex(mask?.maskValue);
    return regex.test(value);
  },
  stringInspectionValidator: (value: string, validator: Record<any, any>) => {
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
  correctPasswordValidator: (value: string, repeatValue: any) => {
    return value === repeatValue;
  },
};
