import { StyleSheet, Text, View } from 'react-native';
import { FnbItem } from '../../types/fnb';
import { FoodImage } from '../common/FoodImage';
import { Price } from '../common/Price';
import { QuantityStepper } from '../common/QuantityStepper';
import { VegNonVegBadge } from '../common/VegNonVegBadge';
import { colors, radius, spacing, typography } from '../../theme';

export interface FoodItemCardProps {
  item: FnbItem;
}

/**
 * Row in the vertical main food list. Shows food type, name, rate and the
 * Add / quantity control (requirement 5). Repeat items render here too — they
 * are NOT removed from this list, only mirrored into the RepeatList.
 */
export function FoodItemCard({ item }: FoodItemCardProps) {
  return (
    <View style={styles.row}>
      <FoodImage uri={item.imageUri} style={styles.image} fallbackIconSize={20} />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <VegNonVegBadge type={item.foodType} size={13} />
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
        </View>
        <Price price={item.price} mrp={item.mrp} />
      </View>

      <View style={styles.action}>
        <QuantityStepper itemId={item.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  image: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    height: 48,
    width: 48,
  },
  info: { flex: 1, gap: spacing.xs },
  nameRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs },
  name: { ...typography.body, color: colors.text, flex: 1, fontWeight: '600' },
  action: { alignItems: 'flex-end' },
});
