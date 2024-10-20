/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { compileRegex } from './compileRegex';

export type Validators = {
  requiredValidator: (value: string, validator: any) => boolean;
  emailInspectionValidator: (value: string, validator: any) => boolean;
  fieldMaskValidator: (value: string, validator: any) => boolean;
  stringInspectionValidator: (value: string, validator: any) => boolean;
  correctPasswordValidator: (value: string, validator: any) => boolean;
};

export const validators: Validators = {
  requiredValidator: (value: string, validator: any) => {
    return !!value.length;
  },
  emailInspectionValidator: (value: string, validator?: any) => {
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
