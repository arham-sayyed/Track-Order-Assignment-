import { useEffect, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Tapping the in-field (x) clears the text but keeps the bar open. */
  onClear: () => void;
  placeholder?: string;
}

/**
 * Toolbar search field (bug fix: the toolbar search icon was inert).
 *
 * Rendered by TrackOrderScreen directly under the Toolbar and OUTSIDE the
 * SectionList, so it never interferes with the sticky FilterBar. Auto-focuses
 * on mount because it only exists while the search icon is toggled on.
 * The matched query is ANDed with the veg / category filters in
 * `selectFilteredItems`.
 */
export function SearchBar({ value, onChangeText, onClear, placeholder = 'Search snacks, drinks…' }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.field}>
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search food items"
        />
        {value.length > 0 && (
          <Pressable
            hitSlop={8}
            onPress={() => {
              onClear();
              inputRef.current?.focus();
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    padding: 0,
  },
});
