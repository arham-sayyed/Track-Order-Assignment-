import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import glyphMap from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type IconName = keyof typeof glyphMap;

export interface FilterChipProps {
  label: string;
  icon?: IconName;
  active: boolean;
  onPress: () => void;
}

/** Category pill in the filter bar. Active = gold fill. */
export function FilterChip({ label, icon, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      hitSlop={4}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={active ? colors.text : colors.textMuted}
        />
      )}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primaryEdge },
  label: { ...typography.caption, color: colors.textMuted },
  labelActive: { color: colors.text, fontWeight: '700' },
});
