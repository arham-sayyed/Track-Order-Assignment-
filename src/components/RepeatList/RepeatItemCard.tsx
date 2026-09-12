import { StyleSheet, Text, View } from 'react-native';
import { FnbItem } from '../../types/fnb';
import { FoodImage } from '../common/FoodImage';
import { Price } from '../common/Price';
import { QuantityStepper } from '../common/QuantityStepper';
import { VegNonVegBadge } from '../common/VegNonVegBadge';
import { colors, radius, spacing, typography } from '../../theme';

export interface RepeatItemCardProps {
  item: FnbItem;
}

/** Card for the horizontal "REPEAT AGAIN?" list (white card on the cream band). */
export function RepeatItemCard({ item }: RepeatItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <FoodImage uri={item.imageUri} style={styles.image} fallbackIconSize={18} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <VegNonVegBadge type={item.foodType} size={12} />
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>
          </View>
          <Price price={item.price} mrp={item.mrp} showBadge={false} />
        </View>
      </View>
      <QuantityStepper itemId={item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.sm + 2,
    width: 210,
  },
  top: { flexDirection: 'row', gap: spacing.sm },
  image: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    height: 44,
    width: 44,
  },
  info: { flex: 1, gap: 2 },
  nameRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.xs },
  name: { ...typography.caption, color: colors.text, flex: 1, fontWeight: '600' },
});
