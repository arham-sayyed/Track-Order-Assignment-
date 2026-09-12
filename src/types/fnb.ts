/**
 * Domain types for the F&B Track Order screen.
 *
 * `Raw*` types mirror the shape of the bundled `assets/data/fnb.json`.
 * `FnbItem` / `CartLine` are the normalized shapes the UI works with.
 */

/** Normalized food type. Raw JSON uses "Veg" | "veg" | "Non Veg". */
export type FoodType = 'VEG' | 'NON_VEG';

export type Category = 'SNACKS' | 'POPCORN' | 'COMBOS' | 'COLD BEVERAGES' | 'HOT BEVERAGES';

/** Category chips, in the order the assignment lists them. */
export const CATEGORIES: readonly Category[] = [
  'SNACKS',
  'POPCORN',
  'COMBOS',
  'COLD BEVERAGES',
  'HOT BEVERAGES',
] as const;

/** One entry of `listOfFnbItems` in fnb.json (only the fields we use are typed). */
export interface RawFnbItem {
  itemId: string;
  itemName: string;
  /** Bare base64 JPEG payload (no `data:` prefix). */
  itemImageURL: string;
  itemRate: number;
  itemOfferRate: number;
  foodType: string;
  itemCategory: string;
  isRepeat: boolean;
  isComboAvailable: boolean;
  comboListItems: unknown[];
  isAddOnAvailable: boolean;
  addOnItems: unknown[];
  isPopuplarItem: boolean;
  calories: string;
  itemWeight: string;
}

export interface RawFnbResponse {
  status: number;
  msg: string;
  listOfFnbItems: RawFnbItem[];
  cinemaDetails?: unknown;
}

/** Normalized item consumed by every list (main, repeat, cart). */
export interface FnbItem {
  id: string;
  name: string;
  /** Ready-to-render `data:image/jpeg;base64,...` URI. */
  imageUri: string;
  /** Effective price = itemOfferRate (falls back to itemRate). */
  price: number;
  /** Original rate; struck through when `price < mrp`. */
  mrp: number;
  foodType: FoodType;
  category: Category;
  isRepeat: boolean;
  calories: string;
  weight: string;
}

/** An item plus its chosen quantity. Only exists while `qty > 0`. */
export interface CartLine {
  item: FnbItem;
  qty: number;
}
