import { StyleSheet, Text, View } from 'react-native';
import { discountPercent, formatPrice } from '../../utils/format';
import { colors, radius, typography } from '../../theme';

export interface PriceProps {
  /** Effective (payable) price. */
  price: number;
  /** Original rate. When greater than `price`, shown struck-through. */
  mrp?: number;
  /** Show the "N% OFF" pill when discounted (default true). */
  showBadge?: boolean;
}

/**
 * Price line shared by the main list, repeat list and cart. Renders just the
 * effective price normally; adds a struck MRP and an optional "N% OFF" pill
 * when `mrp > price` (the F&B catalogue has real offer rates, e.g. COKE
 * REGULAR ₹179 → ₹100).
 */
export function Price({ price, mrp, showBadge = true }: PriceProps) {
  const discounted = mrp != null && mrp > price;
  const pct = discounted ? discountPercent(price, mrp) : 0;

  return (
    <View style={styles.row}>
      <Text style={styles.price}>{formatPrice(price)}</Text>
      {discounted && <Text style={styles.mrp}>{formatPrice(mrp)}</Text>}
      {discounted && showBadge && pct > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pct}% OFF</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  price: { ...typography.caption, color: colors.textMuted },
  mrp: { ...typography.caption, color: colors.textMuted, textDecorationLine: 'line-through' },
  badge: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: colors.success, fontSize: 10, fontWeight: '700' },
});
