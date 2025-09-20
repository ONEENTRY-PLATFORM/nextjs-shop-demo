import type { PayloadAction } from '@reduxjs/toolkit'; // Importing the PayloadAction type for defining action payloads.
import { createSlice } from '@reduxjs/toolkit'; // Importing createSlice from Redux Toolkit to create a slice of the Redux state.

// Define a type for individual form fields, including their value and validity status.
type FieldType = {
  value: string; // The value of the form field as a string.
  valid: boolean; // A boolean indicating whether the field's value is considered valid.
};

// Define a type for the initial state structure.
type InitialStateType = {
  fields: {
    [key: string]: FieldType; // An object where each key is a field name and the value is a FieldType.
  };
};

/**
 * Initialize the state with an empty fields object.
 */
const initialState: InitialStateType = {
  fields: {}, // Start with no fields defined.
};

/**
 * Utility function to get the first key of an object.
 *
 * Returns the first key if it exists, otherwise returns undefined.
 */
function getFirstKey(obj: Record<string, FieldType>): string | undefined {
  const keys = Object.keys(obj); // Get all keys of the object.
  return keys.length > 0 ? keys[0] : undefined; // Return the first key if available.
}

/**
 * Create a slice for managing form fields.
 */
const formFieldsSlice = createSlice({
  name: 'form-fields', // Name of the slice.
  initialState, // The initial state defined above.
  reducers: {
    // add a new field to the form.
    addField(state, action: PayloadAction<{ [key: string]: FieldType }>) {
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

// Export the addField action for use in dispatching.
export const { addField } = formFieldsSlice.actions;

// Export the reducer to be used in the store configuration.
export default formFieldsSlice.reducer;
