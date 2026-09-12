import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../types/fnb';

/**
 * Filters are combinable (requirement 2). Veg / Non-Veg are two independent
 * toggles (as in the Figma), ANDed with the selected category set and the
 * free-text search query:
 *   - veg only            -> VEG items
 *   - nonVeg only         -> NON_VEG items
 *   - both or neither on  -> no food-type restriction
 *   - categories empty    -> all categories
 *   - query empty         -> no name restriction
 */
export interface FiltersState {
  veg: boolean;
  nonVeg: boolean;
  categories: Category[];
  /** Free-text search over item name (toolbar search). Trimmed at read time. */
  query: string;
}

const initialState: FiltersState = { veg: false, nonVeg: false, categories: [], query: '' };

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleVeg(state) {
      state.veg = !state.veg;
    },
    toggleNonVeg(state) {
      state.nonVeg = !state.nonVeg;
    },
    toggleCategory(state, action: PayloadAction<Category>) {
      const cat = action.payload;
      const idx = state.categories.indexOf(cat);
      if (idx >= 0) state.categories.splice(idx, 1);
      else state.categories.push(cat);
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const { toggleVeg, toggleNonVeg, toggleCategory, setQuery, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
