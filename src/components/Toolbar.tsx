import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export interface ToolbarProps {
  title: string;
  /** Small location line under the title (Figma shows "PVR Plaza, New Delhi"). */
  location?: string;
  onBack?: () => void;
  onSearch?: () => void;
  onOrders?: () => void;
}

/**
 * Top app bar. Rendered OUTSIDE the scroll list in TrackOrderScreen so it
 * stays pinned at the very top at all times (requirements 1 & 6).
 */
export function Toolbar({ title, location, onBack, onSearch, onOrders }: ToolbarProps) {
  return (
    <View style={styles.root}>
      <Pressable hitSlop={10} onPress={onBack} style={styles.back} disabled={!onBack}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.location}>{location}</Text>
          </View>
        )}
      </View>

      {onOrders && (
        <Pressable
          hitSlop={10}
          onPress={onOrders}
          style={styles.search}
          accessibilityLabel="Your orders"
        >
          <Ionicons name="receipt-outline" size={20} color={colors.text} />
        </Pressable>
      )}

      <Pressable hitSlop={10} onPress={onSearch} style={styles.search} disabled={!onSearch}>
        <Ionicons name="search" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { marginLeft: -spacing.xs },
  titleBlock: { flex: 1 },
  title: { ...typography.h1, color: colors.text, fontSize: 18 },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 2 },
  location: { ...typography.caption, color: colors.textMuted },
  search: { padding: spacing.xs },
});
