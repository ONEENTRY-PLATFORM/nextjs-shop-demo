import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import CameraIcon from '@/components/icons/camera';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

import StarRating from './StarRating';

interface SelectOption {
  value: string;
  title: string;
}

interface FieldValidators {
  requiredValidator?: {
    strict: boolean;
  };
  stringInspectionValidator?: {
    stringMin?: number;
    stringMax?: number;
  };
}

interface LocalizeInfo {
  title: string;
}

interface FormInputProps {
  marker: string;
  type: string;
  value: string | number;
  validators?: FieldValidators;
  index?: number;
  listTitles?: SelectOption[];
  localizeInfos?: LocalizeInfo;
  className?: string;
}

const RATING_MARKER = 'rating';

/**
 * Determines field type based on marker or provided type.
 * @param   {string} marker - Field marker
 * @param   {string} type   - Field type
 * @returns {string}        Resolved field type
 */
const getFieldType = (marker: string, type: string): string => {
  if (marker.includes('password')) return 'password';
  if (marker.includes('email')) return 'email';
  return type;
};

/**
 * FormInput component for rendering various types of form fields.
 * Handles text inputs, textareas, select dropdowns, and password fields with show/hide functionality.
 * @param   {FormInputProps} field - Field properties
 * @returns {JSX.Element}          Form input component
 */
const FormInput = (field: FormInputProps): JSX.Element => {
  const { localizeInfos, validators, marker, index, listTitles, className } =
    field;

  const [value, setValue] = useState<string | number>(field.value || '');
  const [files, setFiles] = useState<File[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  // Memoized field type determination
  const fieldType = useMemo(() => {
    const detectedType = getFieldType(marker, field.type);
    return (
      (FormFieldsEnum as unknown as Record<string, string>)[detectedType] ||
      detectedType
    );
  }, [marker, field.type]);

  // Calculate input type with password visibility toggle
  const inputType = useMemo(() => {
    if (fieldType === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return fieldType || 'text';
  }, [fieldType, showPassword]);

  // Check if field is required
  const isRequired = useMemo(
    () => validators?.requiredValidator?.strict || false,
    [validators],
  );

  // Get min/max length validators
  const minLength = useMemo(
    () => validators?.stringInspectionValidator?.stringMin,
    [validators],
  );

  const maxLength = useMemo(
    () => validators?.stringInspectionValidator?.stringMax,
    [validators],
  );

  // Determine autocomplete attribute
  const autoComplete = useMemo(() => {
    if (fieldType === 'password') return 'current-password';
    if (fieldType === 'email') return 'email';
    return undefined;
  }, [fieldType]);

  // Handle input change
  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValue(event.currentTarget.value);
    },
    [],
  );

  // Handle file upload
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.currentTarget.files;
      if (fileList && fileList.length > 0) {
        setFiles(Array.from(fileList));
      }
    },
    [],
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setShowPassword((prev) => !prev);
    },
    [],
  );

  // Calculate CSS class name
  const inputClassName = useMemo(() => {
    const defaultClassName =
      'relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800';
    return className || defaultClassName;
  }, [className]);

  // Update Redux store when value changes
  useEffect(() => {
    dispatch(
      addField({
        [marker]: {
          valid: true,
          value: field.type === 'groupOfImages' ? files : value,
        },
      }),
    );
  }, [value, files, marker, field.type, dispatch]);

  if (!field || !inputType) {
    return <></>;
  }

  return (
    <FormFieldAnimations index={index ?? 0} className="input-group">
      <label htmlFor={marker} className="text-gray-400 cursor-pointer">
        {localizeInfos?.title}{' '}
        {isRequired && <span className="text-red-500">*</span>}
      </label>

      {field.type === 'list' && (
        <select
          id={marker}
          className={inputClassName}
          required={isRequired}
          value={value}
          onChange={handleInputChange}
        >
          {listTitles?.map((option, i) => (
            <option key={i} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
      )}

      {field.type === 'textarea' && (
        <textarea
          id={marker}
          placeholder={localizeInfos?.title}
          className={inputClassName}
          required={isRequired}
          onChange={handleInputChange}
          value={value}
        />
      )}

      {field.type === 'groupOfImages' && (
        <div className={`flex items-center gap-4 group ${inputClassName}`}>
          <CameraIcon />
          <input
            type="file"
            id={marker}
            placeholder={localizeInfos?.title}
            required={isRequired}
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
        </div>
      )}

      {marker === RATING_MARKER && (
        <StarRating
          value={value}
          setValue={setValue}
          type={inputType}
          field={field}
          required={isRequired}
        />
      )}

      {field.type !== 'textarea' &&
        field.type !== 'list' &&
        field.type !== 'groupOfImages' &&
        marker !== RATING_MARKER && (
          <input
            type={inputType}
            id={marker}
            placeholder={localizeInfos?.title}
            className={inputClassName}
            required={isRequired}
            onChange={handleInputChange}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            value={value}
          />
        )}

      {field.type === 'password' && (
        <button
          onClick={togglePasswordVisibility}
          className="absolute bottom-2 right-2 flex size-6 items-center"
          type="button"
        >
          {showPassword ? <EyeOpenIcon /> : <EyeIcon />}
        </button>
      )}
    </FormFieldAnimations>
  );
};

export default FormInput;
