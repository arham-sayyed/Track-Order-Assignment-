import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import glyphMap from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { toggleCategory, toggleNonVeg, toggleVeg } from '../../store/filtersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Category, CATEGORIES } from '../../types/fnb';
import { colors, spacing, typography } from '../../theme';
import { FilterChip } from './FilterChip';

type IconName = keyof typeof glyphMap;

const CATEGORY_ICON: Record<Category, IconName> = {
  SNACKS: 'french-fries',
  POPCORN: 'popcorn',
  COMBOS: 'food-variant',
  'COLD BEVERAGES': 'cup',
  'HOT BEVERAGES': 'coffee-outline',
};

/**
 * Sticky filter row (requirements 2 & 6). Veg / Non-Veg are independent
 * toggle switches; categories are gold pills. All are ANDed together in
 * `selectFilteredItems`. Rendered as the sticky section header of the
 * TrackOrderScreen list, so it stays pinned under the Toolbar while the
 * main list scrolls.
 */
export function FilterBar() {
  const dispatch = useAppDispatch();
  const veg = useAppSelector((s) => s.filters.veg);
  const nonVeg = useAppSelector((s) => s.filters.nonVeg);
  const categories = useAppSelector((s) => s.filters.categories);

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.toggle}>
          <MaterialCommunityIcons name="leaf" size={14} color={colors.veg} />
          <Text style={styles.toggleLabel}>Veg</Text>
          <Switch
            value={veg}
            onValueChange={() => {
              dispatch(toggleVeg());
            }}
            trackColor={{ true: colors.veg, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.toggle}>
          <MaterialCommunityIcons name="food-drumstick" size={14} color={colors.nonVeg} />
          <Text style={styles.toggleLabel}>Non Veg</Text>
          <Switch
            value={nonVeg}
            onValueChange={() => {
              dispatch(toggleNonVeg());
            }}
            trackColor={{ true: colors.nonVeg, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.divider} />

        {CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            label={category}
            icon={CATEGORY_ICON[category]}
            active={categories.includes(category)}
            onPress={() => dispatch(toggleCategory(category))}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  toggle: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  toggleLabel: { ...typography.caption, color: colors.text, fontWeight: '600' },
  divider: {
    backgroundColor: colors.border,
    height: 20,
    marginHorizontal: spacing.xs,
    width: StyleSheet.hairlineWidth,
  },
});
