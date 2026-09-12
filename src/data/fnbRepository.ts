/**
 * Loads and normalizes the bundled F&B catalogue.
 *
 * Data source: `assets/data/fnb.json` -> `listOfFnbItems`
 * (per the assignment; you may edit that raw JSON if needed).
 */
import rawJson from '../../assets/data/fnb.json';
import { CATEGORIES, Category, FnbItem, FoodType, RawFnbItem, RawFnbResponse } from '../types/fnb';

function normalizeFoodType(value: string): FoodType {
  // Raw values seen: "Veg", "veg", "Non Veg".
  return value.trim().toLowerCase().startsWith('non') ? 'NON_VEG' : 'VEG';
}

function normalizeCategory(value: string): Category {
  const upper = value.trim().toUpperCase();
  if ((CATEGORIES as readonly string[]).includes(upper)) {
    return upper as Category;
  }
  // TODO: map any aliases discovered in the data; SNACKS is a safe default.
  if (__DEV__) console.warn(`[fnbRepository] Unknown category "${value}", using SNACKS`);
  return 'SNACKS';
}

function toDataUri(payload: string): string {
  return payload.startsWith('data:') ? payload : `data:image/jpeg;base64,${payload}`;
}

/** Map one raw JSON entry to the normalized UI model. */
export function mapRawItem(raw: RawFnbItem): FnbItem {
  return {
    id: raw.itemId,
    name: raw.itemName,
    imageUri: toDataUri(raw.itemImageURL),
    price: raw.itemOfferRate || raw.itemRate,
    mrp: raw.itemRate,
    foodType: normalizeFoodType(raw.foodType),
    category: normalizeCategory(raw.itemCategory),
    isRepeat: Boolean(raw.isRepeat),
    calories: raw.calories,
    weight: raw.itemWeight,
  };
}

let cache: FnbItem[] | null = null;

/** All catalogue items, normalized and memoized for the app session. */
export function getAllFnbItems(): FnbItem[] {
  if (!cache) {
    const response = rawJson as unknown as RawFnbResponse;
    cache = response.listOfFnbItems.map(mapRawItem);
  }
  return cache;
}
