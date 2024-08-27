import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type FieldType = {
  value: string;
  valid: boolean;
};

type InitialStateType = {
  fields: {
    [key: string]: FieldType;
  };
};

const initialState: InitialStateType = {
  fields: {},
};

function getFirstKey(obj: Record<string, FieldType>): string | undefined {
  const keys = Object.keys(obj);
  return keys.length > 0 ? keys[0] : undefined;
}

const formFieldsSlice = createSlice({
  name: 'form-fields',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<{ [key: string]: FieldType }>) {
      const key = getFirstKey(action.payload);
      if (key) {
        state.fields[key] = action.payload[key];
      }
    },
  },
});

export const { addField } = formFieldsSlice.actions;

export default formFieldsSlice.reducer;
