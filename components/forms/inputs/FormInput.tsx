import type { IFormAttribute } from 'oneentry/dist/forms/formsInterfaces';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addField } from '@/app/store/reducers/FormFieldsSlice';
import { FormFieldsEnum } from '@/app/types/enum';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';
import CameraIcon from '@/components/icons/camera';
import EyeIcon from '@/components/icons/eye';
import EyeOpenIcon from '@/components/icons/eye-o';

import StarRating from './StarRating';

/**
 * Props for FormInput — the SDK form field definition (`IFormAttribute`) plus
 * view-only extras. All schema fields except `marker`/`type` are optional at
 * the call site, so callers may spread the whole field object or pass only the
 * subset they hold; the shape itself always comes from the SDK type.
 * @property {string}          marker      - Field marker (machine name).
 * @property {string}          type        - Field type from the form attributes.
 * @property {string | number} value       - Current field value.
 * @property {number}          [index]     - Field index for staggered animations.
 * @property {string}          [className] - CSS class name override.
 */
type FormInputProps = Partial<
  Pick<
    IFormAttribute,
    | 'position'
    | 'isVisible'
    | 'localizeInfos'
    | 'initialValue'
    | 'listTitles'
    | 'validators'
    | 'settings'
    | 'additionalFields'
    | 'isLogin'
    | 'isSignUp'
    | 'isPassword'
    | 'isSignUpRequired'
    | 'isNotificationEmail'
    | 'isNotificationPhonePush'
    | 'isNotificationPhoneSMS'
  >
> & {
  marker: string;
  type: string;
  value: string | number;
  index?: number | undefined;
  className?: string | undefined;
};

/**
 * FormInput component for rendering various types of form fields.
 * Handles text inputs, textareas, select dropdowns, and password fields with show/hide functionality.
 * @param   {FormInputProps} field - Field properties (SDK form attribute plus view extras).
 * @returns {JSX.Element}          Form input.
 */
const FormInput = (field: FormInputProps): JSX.Element => {
  const { localizeInfos, additionalFields } = field;

  /* Placeholder/hint sourced from admin-configured additionalFields, falling back to the label */
  const placeholder =
    (additionalFields?.placeholder?.value as string) ||
    localizeInfos?.title ||
    '';
  const hint = additionalFields?.hint?.value as string | undefined;

  /* State for storing the current value of the input field */
  const [value, setValue] = useState<string | number>(field.value || '');

  /* State for storing uploaded files */
  const [files, setFiles] = useState<File[]>([]);

  /* State for toggling password visibility (text/password) */
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* Redux dispatch function for updating form field values in the store */
  const dispatch = useAppDispatch();

  /* Get field data from Redux store */
  const fieldData = useAppSelector(
    (state) => state.formFieldsReducer.fields[field.marker],
  );

  /* Validation state (currently always true) */
  const valid = true;

  /**
   * Determine the field type based on marker or provided type
   * Special handling for email and password fields
   */
  const fieldTypeKey =
    field?.marker?.indexOf('password') !== -1
      ? 'password'
      : field.marker.indexOf('email') !== -1
        ? 'email'
        : field.type;
  const fieldType = (FormFieldsEnum as unknown as Record<string, string>)[
    fieldTypeKey
  ];

  /**
   * Calculate the actual input type
   * For password fields, toggle between 'password' and 'text' based on visibility state
   */
  const type =
    fieldType === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : fieldType || 'text';

  /* Check if the field is required based on validators */
  const required = field?.validators?.['requiredValidator']?.strict || false;

  /**
   * Sync local state when fieldData is cleared from the Redux store.
   * Adjusting state during render (rather than in an effect) avoids a cascading
   * render cycle and is the React-recommended pattern for prop-driven resets.
   * See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
   */
  const [prevFieldData, setPrevFieldData] = useState(fieldData);
  if (prevFieldData !== fieldData && !fieldData) {
    setPrevFieldData(fieldData);
    setValue(field.value || '');
    setFiles([]);
  }

  /* Effect to update the Redux store when field value or validation state changes */
  useEffect(() => {
    dispatch(
      addField({
        [field.marker]: {
          valid: valid,
          value: field.type === 'groupOfImages' ? files : value,
        },
      }),
    );
  }, [value, files, valid, field.marker, field.type, dispatch]);

  /* Return empty element if field or type is not defined */
  if (!field || !type) {
    return <></>;
  }

  const defaultClassName =
    'relative border-b border-solid border-[none] border-b-stone-300 py-3 text-base leading-5 text-slate-800';

  const cn = field.className || defaultClassName;

  return (
    <FormFieldAnimations index={field.index as number} className="input-group">
      {/** Label for the form field * Shows an asterisk if the field is required */}
      <label htmlFor={field.marker} className="cursor-pointer text-gray-400">
        {localizeInfos?.title}{' '}
        {required && <span className="text-red-500">*</span>}
      </label>
      {/** Render select dropdown for list type fields */}
      {field.type === 'list' && (
        <select
          id={field.marker}
          className={cn}
          required={required}
          value={value}
          onChange={(val) => setValue(val.currentTarget.value)}
        >
          {field.listTitles?.map((option) => {
            return (
              <option key={String(option.value)} value={String(option.value)}>
                {option.title}
              </option>
            );
          })}
        </select>
      )}
      {/** Render textarea for textarea type fields */}
      {field.type === 'textarea' && (
        <textarea
          id={field.marker}
          placeholder={placeholder}
          className={cn}
          required={required}
          onChange={(val) => setValue(val.currentTarget.value)}
          value={value}
        />
      )}
      {/** Render groupOfImages type field */}
      {field.type === 'groupOfImages' && (
        <div className={'group flex items-center gap-4 ' + cn}>
          <CameraIcon />
          <input
            type="file"
            id={field.marker}
            placeholder={placeholder}
            // className={cn}
            required={required}
            onChange={async (val) => {
              const fileList = val.currentTarget.files;
              if (fileList && fileList.length > 0) {
                // Convert FileList to Array and recreate files without contentType
                const filesArray = await Promise.all(
                  Array.from(fileList).map(async (file) => {
                    // Create a new File object without contentType property
                    const blob = await file.arrayBuffer();
                    return new File([blob], file.name, { type: file.type });
                  }),
                );
                setFiles(filesArray);
              }
            }}
            multiple
            accept="image/*"
          />
        </div>
      )}
      {/** Render 5 stars rating field  if marker is 'rating' */}
      {field.marker === 'rating' && (
        <StarRating
          value={value}
          setValue={setValue}
          type={type}
          field={field}
          required={required}
        />
      )}
      {/** Render standard input for all other field types text/password/email... */}
      {field.type !== 'textarea' &&
        field.type !== 'list' &&
        field.type !== 'groupOfImages' &&
        field.marker !== 'rating' && (
          <input
            type={type}
            id={field.marker}
            placeholder={placeholder}
            className={cn}
            required={required}
            onChange={(val) => setValue(val.currentTarget.value)}
            autoComplete={fieldType === 'password' ? 'password' : ''}
            minLength={
              field.validators?.['stringInspectionValidator']?.stringMin
            }
            maxLength={
              field.validators?.['stringInspectionValidator']?.stringMax
            }
            value={value}
          />
        )}
      {/** Render admin-configured hint text below the input */}
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
      {/** Render password visibility toggle button for password fields */}
      {field.type === 'password' && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowPassword((prev) => !prev);
          }}
          className="absolute right-2 bottom-2 flex size-6 items-center"
        >
          {showPassword ? <EyeOpenIcon /> : <EyeIcon />}
        </button>
      )}
    </FormFieldAnimations>
  );
};

export default FormInput;
