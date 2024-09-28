import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentType = any;

type FiltersDataType = {
  prices: {
    min: number;
    max: number;
  };
};

type InitialStateType = {
  content: ContentType;
  filtersData: FiltersDataType;
};

const initialState: InitialStateType = {
  content: {},
  filtersData: {
    prices: {
      min: 0,
      max: 100,
    },
  },
};

export const systemContentSlice = createSlice({
  name: 'system-slice',
  initialState,
  reducers: {
    addContent(state, action: PayloadAction<ContentType>) {
      state.content = action.payload;
    },
    addFiltersData(state, action: PayloadAction<FiltersDataType>) {
      state.content.filtersData = action.payload;
    },
  },
});

export const getFiltersData = (state: {
  systemContentReducer: { filtersData: FiltersDataType };
}) => {
  return state.systemContentReducer.filtersData;
};

export const { addContent, addFiltersData } = systemContentSlice.actions;

export default systemContentSlice.reducer;
