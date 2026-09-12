/**
 * Derived reads over (catalogue x cart x filters).
 *
 * Components never filter or total in render — they call these memoized
 * selectors so every list stays consistent and cheap to re-render.
 */
import { createSelector } from '@reduxjs/toolkit';
import { getAllFnbItems } from '../data/fnbRepository';
import type { RootState } from '../store';
import { CartLine, FnbItem, FoodType } from '../types/fnb';

const selectAllItems = (_state: RootState): FnbItem[] => getAllFnbItems();
const selectQuantities = (state: RootState) => state.cart.quantities;
const selectVeg = (state: RootState) => state.filters.veg;
const selectNonVeg = (state: RootState) => state.filters.nonVeg;
const selectCategories = (state: RootState) => state.filters.categories;
const selectQuery = (state: RootState) => state.filters.query;

/** Resolve the two veg toggles to a single restriction (or null = no filter). */
function foodTypeFilter(veg: boolean, nonVeg: boolean): FoodType | null {
  if (veg && !nonVeg) return 'VEG';
  if (nonVeg && !veg) return 'NON_VEG';
  return null;
}

/** Main vertical list data: catalogue after veg + category + search filters (combinable). */
export const selectFilteredItems = createSelector(
  [selectAllItems, selectVeg, selectNonVeg, selectCategories, selectQuery],
  (items, veg, nonVeg, categories, query) => {
    const ft = foodTypeFilter(veg, nonVeg);
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const vegOk = ft === null || item.foodType === ft;
      const catOk = categories.length === 0 || categories.includes(item.category);
      const queryOk = q === '' || item.name.toLowerCase().includes(q);
      return vegOk && catOk && queryOk;
    });
  },
);

/**
 * Horizontal repeat list data: items with `isRepeat === true`.
 * NOTE: not affected by the filter bar — repeat items are always shown.
 */
export const selectRepeatItems = createSelector([selectAllItems], (items) =>
  items.filter((item) => item.isRepeat),
);

/** Quantity for one item id (0 when not in the cart). */
export const selectQtyById =
  (id: string) =>
  (state: RootState): number =>
    state.cart.quantities[id] ?? 0;

/** Cart contents (qty > 0), kept in stable catalogue order. */
export const selectCartLines = createSelector(
  [selectAllItems, selectQuantities],
  (items, quantities): CartLine[] =>
    items
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({ item, qty: quantities[item.id] })),
);

/** Total number of units in the cart (for the summary bar). */
export const selectCartCount = createSelector([selectQuantities], (quantities) =>
  Object.values(quantities).reduce((sum, n) => sum + n, 0),
);

/** Cart value using each item's effective price. */
export const selectCartTotal = createSelector([selectCartLines], (lines) =>
  lines.reduce((sum, line) => sum + line.item.price * line.qty, 0),
);

/** Number of distinct items in the cart ("N items" label). */
export const selectCartLineCount = createSelector([selectCartLines], (lines) => lines.length);
