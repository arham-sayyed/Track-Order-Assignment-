import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  body: { padding: spacing.lg, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  cardTitle: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  cinemaLine: { ...typography.body, color: colors.text },
  row: { flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  rowLabel: { ...typography.body, color: colors.textMuted, flex: 1 },
  rowValue: { ...typography.body, color: colors.text, flexShrink: 0, textAlign: 'right' },
  totalLabel: { ...typography.title, color: colors.text, flex: 1 },
  totalValue: { ...typography.title, color: colors.text, flexShrink: 0, textAlign: 'right' },
  error: { ...typography.caption, color: colors.nonVeg },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  payButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
  },
  payButtonDisabled: { backgroundColor: colors.border },
  payText: { ...typography.title, color: colors.text, fontSize: 15, fontWeight: '700' },
});
