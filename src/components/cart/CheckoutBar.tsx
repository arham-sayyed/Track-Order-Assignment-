import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  selectCartCount,
  selectCartLineCount,
  selectCartTotal,
} from '../../selectors/fnbSelectors';
import { useAppSelector } from '../../store/hooks';
import { formatAmount } from '../../utils/format';
import { colors, radius, spacing, typography } from '../../theme';

export interface CheckoutBarProps {
  /** Tapping the cream summary bar opens the cart bottom sheet. */
  onOpenCart: () => void;
  onProceed: () => void;
  /** Safe-area bottom inset. */
  bottomInset?: number;
}

/**
 * Persistent bottom bar (matches the Figma): a cream summary strip
 * ("N items" + total) that opens the cart, above a full-width gold
 * "Proceed" button. Hidden entirely when the cart is empty.
 */
export function CheckoutBar({ onOpenCart, onProceed, bottomInset = 0 }: CheckoutBarProps) {
  const units = useAppSelector(selectCartCount);
  const lines = useAppSelector(selectCartLineCount);
  const total = useAppSelector(selectCartTotal);
  if (units === 0) return null;

  return (
    <View style={[styles.wrap, { paddingBottom: bottomInset + spacing.sm }]}>
      <Pressable style={styles.summary} onPress={onOpenCart} accessibilityRole="button">
        <View style={styles.summaryLeft}>
          <Ionicons name="cart" size={18} color={colors.text} />
          <Text style={styles.summaryText}>
            {lines} {lines === 1 ? 'item' : 'items'} added
          </Text>
          <Ionicons name="chevron-up" size={14} color={colors.text} />
        </View>
        <Text style={styles.summaryText}>{formatAmount(total)}</Text>
      </Pressable>

      <Pressable style={styles.proceed} onPress={onProceed} accessibilityRole="button">
        <Text style={styles.proceedText}>Proceed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  summary: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryLeft: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  summaryText: { ...typography.title, color: colors.text, fontSize: 14 },
  proceed: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
  },
  proceedText: { ...typography.title, color: colors.text, fontSize: 15, fontWeight: '700' },
});
