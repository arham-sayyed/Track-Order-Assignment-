import { FlatList, StyleSheet, Text, View } from 'react-native';
import { selectRepeatItems } from '../../selectors/fnbSelectors';
import { useAppSelector } from '../../store/hooks';
import { colors, spacing, typography } from '../../theme';
import { RepeatItemCard } from './RepeatItemCard';

/**
 * "REPEAT AGAIN?" — horizontal list of items with `isRepeat === true`
 * (requirement 4), shown between the Toolbar and the sticky FilterBar.
 *
 * Quantities come from `cartSlice` via each card's QuantityStepper, so this
 * list and the main list stay in lock-step automatically.
 */
export function RepeatList() {
  const items = useAppSelector(selectRepeatItems);
  if (items.length === 0) return null;

  return (
    <View style={styles.root}>
      <View style={styles.headingRow}>
        <View style={styles.rule} />
        <Text style={styles.heading}>REPEAT AGAIN?</Text>
        <View style={styles.rule} />
      </View>

      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <RepeatItemCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.cream, paddingBottom: spacing.md, paddingTop: spacing.sm },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  rule: { backgroundColor: colors.primaryEdge, flex: 1, height: 1, maxWidth: 48, opacity: 0.5 },
  heading: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  listContent: { gap: spacing.md, paddingHorizontal: spacing.lg },
});
