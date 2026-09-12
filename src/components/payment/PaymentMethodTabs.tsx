import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PaymentMethod } from '../../payments/types';
import { colors, radius, spacing, typography } from '../../theme';

const METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'upi', label: 'UPI' },
  { key: 'card', label: 'Card' },
  { key: 'netbanking', label: 'Netbanking' },
  { key: 'wallet', label: 'Wallet' },
];

export interface PaymentMethodTabsProps {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}

export function PaymentMethodTabs({ value, onChange }: PaymentMethodTabsProps) {
  return (
    <View style={styles.row}>
      {METHODS.map((m) => (
        <Pressable
          key={m.key}
          onPress={() => onChange(m.key)}
          style={[styles.tab, value === m.key && styles.tabActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: value === m.key }}
        >
          <Text style={[styles.label, value === m.key && styles.labelActive]}>{m.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tab: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primaryEdge },
  label: { ...typography.caption, color: colors.textMuted },
  labelActive: { color: colors.text, fontWeight: '700' },
});
