import type { CartLine, FnbItem } from '../../types/fnb';
import { computeBill } from '../bill';

const item = (over: Partial<FnbItem> = {}): FnbItem => ({
  id: 'i1',
  name: 'Popcorn',
  imageUri: 'data:image/jpeg;base64,xxxx',
  price: 100,
  mrp: 100,
  foodType: 'VEG',
  category: 'POPCORN',
  isRepeat: false,
  calories: '',
  weight: '',
  ...over,
});

const line = (price: number, qty: number): CartLine => ({ item: item({ price }), qty });

describe('computeBill', () => {
  it('is all-zero for an empty cart', () => {
    expect(computeBill([])).toEqual({ subtotal: 0, tax: 0, convenienceFee: 0, total: 0 });
  });

  it('sums line totals, adds 5% GST and a flat ₹20 fee', () => {
    const bill = computeBill([line(100, 2), line(50, 1)]); // subtotal 250
    expect(bill.subtotal).toBe(250);
    expect(bill.tax).toBe(12.5); // 250 * 0.05
    expect(bill.convenienceFee).toBe(20);
    expect(bill.total).toBe(282.5);
  });

  it('rounds tax to 2 decimals', () => {
    const bill = computeBill([line(33.33, 1)]); // subtotal 33.33, tax 1.6665 -> 1.67
    expect(bill.tax).toBe(1.67);
  });
});
