import type { PayloadAction, WritableDraft } from '@reduxjs/toolkit'; // Importing the PayloadAction type for defining action payloads.
import { createSlice } from '@reduxjs/toolkit'; // Importing createSlice from Redux Toolkit to create a slice of the Redux state.

/**
 * Define a type for individual form fields, including their value and validity status.
 * @property {string}  value - The value of the form field as a string, number, or array of files.
 * @property {boolean} valid - A boolean indicating whether the field's value is considered valid.
 */
type FieldType = {
  value: string | number | File[];
  valid: boolean;
};

/**
 * Define a type for the initial state structure.
 * @property {object}    fields      - An object where each key is a field name and the value is a FieldType.
 * @property {FieldType} fields[key] - The FieldType for the field with the given key.
 */
type InitialStateType = {
  fields: {
    [key: string]: FieldType;
  };
};

/**
 * Initialize the state with an empty fields object.
 * @property {object} fields - An empty object for storing form fields.
 */
const initialState: InitialStateType = {
  fields: {},
};

/**
 * Utility function to get the first key of an object.
 * @param   {Record<string, FieldType>} obj - Object to get the first key from.
 * @returns {string | undefined}            The first key if it exists, otherwise returns undefined.
 */
function getFirstKey(obj: Record<string, FieldType>): string | undefined {
  const keys = Object.keys(obj); // Get all keys of the object.
  return keys.length > 0 ? keys[0] : undefined; // Return the first key if available.
}

/**
 * Create a slice for managing form fields.
 * @param name         - Name of the slice.
 * @param initialState - The initial state for the slice.
 * @param reducers     - An object containing the reducer functions for managing the favorites slice.
 */
const formFieldsSlice = createSlice({
  name: 'form-fields', // Name of the slice.
  initialState, // The initial state defined above.
  reducers: {
    /**
     * Add a new field to the form.
     * @param {WritableDraft<InitialStateType>} state  - Current state
     * @param {PayloadAction<string>}           action - Payload with field data
     */
    addField(
      state: WritableDraft<InitialStateType>,
      action: PayloadAction<{ [key: string]: FieldType }>,
    ) {
      const key = getFirstKey(action.payload); // Get the first key from the action payload.
      if (key) {
        const field = action.payload[key];
        if (field) {
          state.fields[key] = field; // Add or update the field in the state.
        }
      }
    },
  },
});

/** Export the addField action for use in dispatching. */
export const { addField } = formFieldsSlice.actions;

/** Export the reducer to be used in the store configuration. */
export default formFieldsSlice.reducer;
