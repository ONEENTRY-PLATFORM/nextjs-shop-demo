import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {CombinedState, createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialStateType = {
  filters: IFilterParams[];
  homeBadgesPrevious?: IFilterParams;
  homeCardsPrevious?: IFilterParams;
  sortFilterActive?: number;
  badgeFilterActive?: number;
  homeBadgeFilterActive?: number;
  colorFilterActive?: number;
  colorFilterPrevious?: number;
  priceFromSelected?: string;
  priceFromPrevious?: string;
  priceToSelected?: string;
  priceToPrevious?: string;
  catalogOffset: number;
  search?: string;
  availability?: boolean;
  minPriceValue?: number;
  maxPriceValue?: number;
};
const initialState: InitialStateType = {
  filters: [],
  sortFilterActive: undefined,
  badgeFilterActive: 0,
  colorFilterActive: undefined,
  priceFromSelected: undefined,
  priceToSelected: undefined,
  catalogOffset: 0,
  homeBadgeFilterActive: undefined,
  search: '',
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

  for (let key in obj1) {
    if (
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
      state.filters = state.filters.filter(filter => {
        const filterWithoutValue: Partial<IFilterParams> = {...filter};
        delete filterWithoutValue.conditionValue;
        const actionWithoutCondition = {...action.payload};
        delete actionWithoutCondition?.conditionValue;
        console.log("=>(FilterSlice.ts:84) action.payload", actionWithoutCondition);

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
      state.search = undefined;
      state.filters = initialState.filters;
      state.homeBadgesPrevious = undefined;
      state.homeBadgeFilterActive = undefined;
      state.badgeFilterActive = 0;
      state.sortFilterActive = undefined;
      state.colorFilterActive = undefined;
      state.priceFromSelected = undefined;
      state.priceToSelected = undefined;
      state.priceFromPrevious = undefined;
      state.priceFromPrevious = undefined;
      state.homeCardsPrevious = undefined;
      state.availability = undefined;
    },
    setSortFilterActive(state, action: PayloadAction<number | undefined>) {
      if (state.sortFilterActive === action.payload) {
        state.sortFilterActive = undefined;
      } else {
        state.sortFilterActive = action.payload;
      }
    },
    setBadgeFilterActive(state, action: PayloadAction<number | undefined>) {
      if (state.badgeFilterActive !== action.payload) {
        state.badgeFilterActive = action.payload;
      }
    },
    setHomeBadgeFilterActive(
      state,
      action: PayloadAction<{
        value: number | undefined;
        previous?: IFilterParams;
      }>,
    ) {
      state.homeBadgeFilterActive = action.payload.value;
      state.homeBadgesPrevious = action.payload.previous;
    },
    setHomeCardPrevious(
      state,
      action: PayloadAction<{
        previous?: IFilterParams;
      }>,
    ) {
      state.homeCardsPrevious = action.payload.previous;
    },
    setAvailability(state, action: PayloadAction<boolean>) {
      state.availability = action.payload;
    },
    setCatalogOffset(state, action: PayloadAction<number>) {
      state.catalogOffset = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string | undefined>) {
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
    setColorFilterActive(state, action: PayloadAction<number | undefined>) {
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
  setHomeBadgeFilterActive,
  setCatalogOffset,
  setSearchValue,
  setHomeCardPrevious,
  setColorFilterActive,
  setAvailability,
  setPriceFilterActive,
} = filterSlice.actions;

export const selectAllFilters = (
  state: CombinedState<{
    cartReducer: {};
    favoritesReducer: {};
    filterReducer: InitialStateType;
  }>,
) => {
  return state.filterReducer.filters;
};

export const selectFiltersByMarker = (
  state: CombinedState<{
    cartReducer: {};
    favoritesReducer: {};
    filterReducer: InitialStateType;
  }>,
  marker: String,
) => {
  return state.filterReducer.filters.filter(
    filter => filter.attributeMarker === marker,
  );
};

export default filterSlice.reducer;
