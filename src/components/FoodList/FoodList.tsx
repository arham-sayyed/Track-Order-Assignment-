import { ReactElement, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { selectFilteredItems } from '../../selectors/fnbSelectors';
import { useAppSelector } from '../../store/hooks';
import { FnbItem } from '../../types/fnb';
import { colors, spacing, typography } from '../../theme';
import { FoodItemCard } from './FoodItemCard';

export interface FoodListProps {
  /** Scrolls away with the content (the RepeatList). */
  scrollAwayHeader: ReactElement;
  /** Pinned below the Toolbar while the list scrolls (the FilterBar). */
  stickyHeader: ReactElement;
  /** Extra bottom padding so the pinned CheckoutBar never covers the last row. */
  bottomInset?: number;
}

/**
 * Main vertical food list (requirement 5) + sticky-filter mechanism
 * (requirement 6).
 *
 * A single `SectionList` owns the whole scroll area:
 *   - `ListHeaderComponent` = RepeatList  -> scrolls away
 *   - one section, `renderSectionHeader` = FilterBar with
 *     `stickySectionHeadersEnabled` -> stays pinned under the Toolbar
 *   - section `data` = filtered FnbItems -> the scrolling rows
 */
export function FoodList({ scrollAwayHeader, stickyHeader, bottomInset = 0 }: FoodListProps) {
  const items = useAppSelector(selectFilteredItems);
  const sections = useMemo(() => [{ key: 'items', data: items }], [items]);

  return (
    <SectionList<FnbItem>
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled
      ListHeaderComponent={scrollAwayHeader}
      renderSectionHeader={() => stickyHeader}
      renderItem={({ item }) => <FoodItemCard item={item} />}
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Text style={styles.empty}>No items match these filters</Text>
        </View>
      }
      contentContainerStyle={[
        { paddingBottom: bottomInset + spacing.xxl },
        items.length === 0 && styles.emptyContainer,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyBox: { padding: spacing.xxl },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});
