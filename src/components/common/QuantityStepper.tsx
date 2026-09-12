import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { decrement, increment } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors, radius, spacing, typography } from '../../theme';

export interface QuantityStepperProps {
  itemId: string;
  /**
   * 'solid'   — filled gold pill (main list, repeat list; matches Figma)
   * 'outline' — light outlined pill (cart sheet; matches the cart reference)
   */
  variant?: 'solid' | 'outline';
}

/**
 * Shared "+ / –" control used by EVERY list (main, repeat, cart).
 *
 * Reads qty straight from `cartSlice` and dispatches increment/decrement for
 * `itemId`. Because all three lists render this same component against the
 * same slice, a change in one place shows up everywhere immediately
 * (requirements 3–5).
 *
 * Renders an "ADD" button while qty === 0, then the stepper.
 */
export function QuantityStepper({ itemId, variant = 'solid' }: QuantityStepperProps) {
  const dispatch = useAppDispatch();
  const qty = useAppSelector((state) => state.cart.quantities[itemId] ?? 0);

  if (qty === 0) {
    return (
      <Pressable
        style={styles.addButton}
        onPress={() => dispatch(increment(itemId))}
        accessibilityRole="button"
        accessibilityLabel="Add to cart"
      >
        <Text style={styles.addLabel}>Add</Text>
      </Pressable>
    );
  }

  const solid = variant === 'solid';
  const iconColor = solid ? colors.text : colors.textMuted;

  return (
    <View style={[styles.stepper, solid ? styles.stepperSolid : styles.stepperOutline]}>
      <Pressable
        hitSlop={8}
        onPress={() => dispatch(decrement(itemId))}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Ionicons name="remove" size={16} color={iconColor} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable
        hitSlop={8}
        onPress={() => dispatch(increment(itemId))}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Ionicons name="add" size={16} color={iconColor} />
      </Pressable>
    </View>
  );
}

const CONTROL_WIDTH = 92;

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryEdge,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    width: CONTROL_WIDTH,
  },
  addLabel: { ...typography.caption, color: colors.text, fontWeight: '700' },
  stepper: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    width: CONTROL_WIDTH,
  },
  stepperSolid: { backgroundColor: colors.primary },
  stepperOutline: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  qty: { ...typography.title, color: colors.text, fontSize: 14 },
});
