import { StyleSheet, Text, View } from 'react-native';
import { CartLine } from '../../types/fnb';
import { formatAmount } from '../../utils/format';
import { FoodImage } from '../common/FoodImage';
import { QuantityStepper } from '../common/QuantityStepper';
import { VegNonVegBadge } from '../common/VegNonVegBadge';
import { colors, radius, spacing, typography } from '../../theme';

export interface CartRowProps {
  line: CartLine;
}

/**
 * One line in the cart bottom sheet (requirement 3): image, name, food type,
 * an outlined "+ / –" control, and the line total. The stepper writes to the
 * same `cartSlice`, so edits here reflect in the main list and repeat list.
 * When the item has an offer rate, the pre-discount line total is shown
 * struck-through above the payable amount.
 */
export function CartRow({ line }: CartRowProps) {
  const { item, qty } = line;
  const discounted = item.mrp > item.price;

  return (
    <View style={styles.row}>
      <FoodImage uri={item.imageUri} style={styles.image} fallbackIconSize={22} />

      <View style={styles.center}>
        <View style={styles.nameRow}>
          <VegNonVegBadge type={item.foodType} size={13} />
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
        </View>
        <QuantityStepper itemId={item.id} variant="outline" />
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.price}>{formatAmount(item.price * qty)}</Text>
        {discounted && <Text style={styles.mrp}>{formatAmount(item.mrp * qty)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  image: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 56,
    width: 56,
  },
  center: { flex: 1, gap: spacing.sm },
  nameRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs },
  name: { ...typography.body, color: colors.text, flex: 1, fontWeight: '600' },
  priceCol: { alignItems: 'flex-end' },
  price: { ...typography.title, color: colors.text, fontSize: 15 },
  mrp: {
    ...typography.caption,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
