/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  filters: IFilterParams[];
  sortFilterActive?: number;
  badgeFilterActive?: number;
  colorFilterActive?: number;
  colorFilterPrevious?: number;
  priceFromSelected: number;
  priceToSelected: number;
  priceFromPrevious?: string;
  priceToPrevious?: string;
  catalogOffset: number;
  search: string;
  availability: boolean;
  minPriceValue: number;
  maxPriceValue: number;
};
const initialState: InitialStateType = {
  filters: [],
  sortFilterActive: undefined,
  badgeFilterActive: 0,
  colorFilterActive: undefined,
  priceFromSelected: 0,
  priceToSelected: 100,
  catalogOffset: 0,
  search: '',
  availability: false,
  minPriceValue: 0,
  maxPriceValue: 100,
};

function areObjectFieldsAndValuesSame(
  obj1: Partial<IFilterParams> | undefined,
  obj2: Partial<IFilterParams> | undefined,
): boolean {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj1) {
    if (
      // eslint-disable-next-line no-prototype-builtins
      !obj2.hasOwnProperty(key) ||
      !areObjectFieldsAndValuesSame((obj1 as any)[key], (obj2 as any)[key])
    ) {
      return false;
    }
  }

  return true;
}

export const filterSlice = createSlice({
  name: 'filter-slice',
  initialState,
  reducers: {
    addFilter(state, action: PayloadAction<IFilterParams>) {
      state.search = undefined;
      state.catalogOffset = 0;
      state.filters.push(action.payload);
    },
    removeFilter(
      state,
      action: PayloadAction<Partial<IFilterParams> | undefined>,
    ) {
      state.search = undefined;
      state.catalogOffset = 0;
      state.filters = state.filters.filter((filter) => {
        const filterWithoutValue: Partial<IFilterParams> = { ...filter };
        delete filterWithoutValue.conditionValue;
        const actionWithoutCondition = { ...action.payload };
        delete actionWithoutCondition?.conditionValue;

        return !areObjectFieldsAndValuesSame(
          filterWithoutValue,
          actionWithoutCondition,
        );
      });
    },
    removePreviousFilter(state) {
      if (state.filters.length > 0) {
        state.filters.pop();
      }
    },
    removeAllFilters(state) {
      state.catalogOffset = 0;
      state.search = '';
      state.filters = initialState.filters;
      state.badgeFilterActive = 0;
      state.sortFilterActive = undefined;
      state.colorFilterActive = undefined;
      state.priceFromSelected = undefined;
      state.priceToSelected = undefined;
      state.priceFromPrevious = undefined;
      state.priceFromPrevious = undefined;
      state.availability = false;
    },
    setSortFilterActive(state, action: PayloadAction<number>) {
      if (state.sortFilterActive === action.payload) {
        state.sortFilterActive = undefined;
      } else {
        state.sortFilterActive = action.payload;
      }
    },
    setBadgeFilterActive(state, action: PayloadAction<number>) {
      if (state.badgeFilterActive !== action.payload) {
        state.badgeFilterActive = action.payload;
      }
    },
    setAvailability(state, action: PayloadAction<boolean>) {
      state.availability = action.payload;
    },
    setCatalogOffset(state, action: PayloadAction<number>) {
      state.catalogOffset = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setPriceFilterActive(
      state,
      action: PayloadAction<{
        value: string | undefined;
        operator: 'from' | 'to';
      }>,
    ) {
      if (action.payload.operator === 'from') {
        state.priceFromSelected = action.payload.value;
      }
      if (action.payload.operator === 'to') {
        state.priceToSelected = action.payload.value;
      }
    },
    setColorFilterActive(state, action: PayloadAction<number>) {
      state.colorFilterPrevious = state.colorFilterActive;

      if (action.payload === state.colorFilterActive) {
        state.colorFilterActive = undefined;
      } else {
        state.colorFilterActive = action.payload;
      }
    },
    addMinMaxFilterPlaceholders(
      state,
      action: PayloadAction<{
        min: number;
        max: number;
      }>,
    ) {
      state.minPriceValue = action.payload.min;
      state.maxPriceValue = action.payload.max;
    },
  },
});

export const {
  addFilter,
  removeAllFilters,
  addMinMaxFilterPlaceholders,
  setSortFilterActive,
  removeFilter,
  setBadgeFilterActive,
  setCatalogOffset,
  setSearchValue,
  setColorFilterActive,
  setAvailability,
  setPriceFilterActive,
} = filterSlice.actions;

export const selectAllFilters = (state: {
  filterReducer: { filters: any };
}) => {
  return state.filterReducer.filters;
};

export const selectFiltersByMarker = (
  state: { filterReducer: { filters: any[] } },
  marker: string,
) => {
  return state.filterReducer.filters.filter(
    (filter: { attributeMarker: string }) => filter.attributeMarker === marker,
  );
};

export default filterSlice.reducer;
