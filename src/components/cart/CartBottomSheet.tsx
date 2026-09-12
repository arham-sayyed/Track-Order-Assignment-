import { forwardRef, useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  selectCartCount,
  selectCartLineCount,
  selectCartLines,
  selectCartTotal,
} from '../../selectors/fnbSelectors';
import { clearCart } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { formatAmount } from '../../utils/format';
import { colors, radius, spacing, typography } from '../../theme';
import { CartRow } from './CartRow';

export type CartBottomSheetRef = BottomSheet;

export interface CartBottomSheetProps {
  onProceed?: () => void;
}

const SNAP_POINTS = ['55%', '90%'];

/**
 * Bottom Sheet Dialog for the cart (requirement 3), styled to the reference:
 * "Your Cart" header, item rows, then a cream summary strip + gold "Proceed".
 *
 * Controlled imperatively via ref: `ref.current?.expand()` / `.close()`.
 * Starts closed (`index={-1}`). Every row's stepper writes to `cartSlice`,
 * so quantity edits here propagate to the main list and repeat list.
 */
export const CartBottomSheet = forwardRef<BottomSheet, CartBottomSheetProps>(
  ({ onProceed }, ref) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const lines = useAppSelector(selectCartLines);
    const lineCount = useAppSelector(selectCartLineCount);
    const units = useAppSelector(selectCartCount);
    const total = useAppSelector(selectCartTotal);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          {lineCount > 0 && (
            <Text style={styles.clear} onPress={() => dispatch(clearCart())}>
              Clear
            </Text>
          )}
        </View>

        <BottomSheetFlatList
          data={lines}
          keyExtractor={(line) => line.item.id}
          renderItem={({ item }) => <CartRow line={item} />}
          ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
          contentContainerStyle={styles.listContent}
        />

        {units > 0 && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.summary}>
              <View style={styles.summaryLeft}>
                <Ionicons name="cart" size={18} color={colors.text} />
                <Text style={styles.summaryText}>
                  {lineCount} {lineCount === 1 ? 'item' : 'items'}
                </Text>
              </View>
              <Text style={styles.summaryText}>{formatAmount(total)}</Text>
            </View>

            <Pressable style={styles.proceed} onPress={onProceed} accessibilityRole="button">
              <Text style={styles.proceedText}>Proceed</Text>
            </Pressable>
          </View>
        )}
      </BottomSheet>
    );
  },
);

CartBottomSheet.displayName = 'CartBottomSheet';

const styles = StyleSheet.create({
  sheetBackground: { backgroundColor: colors.background },
  handle: { backgroundColor: colors.border, width: 40 },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: { ...typography.h1, color: colors.text },
  clear: { ...typography.body, color: colors.textMuted, fontWeight: '600' },
  listContent: { flexGrow: 1, paddingBottom: spacing.lg },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    padding: spacing.xxl,
    textAlign: 'center',
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
