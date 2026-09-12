import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: spacing.xl },
  check: {
    alignItems: 'center', backgroundColor: colors.success, borderRadius: radius.pill,
    height: 64, justifyContent: 'center', marginBottom: spacing.md, width: 64,
  },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  amount: { ...typography.title, color: colors.text, marginBottom: spacing.lg },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  metaLabel: { ...typography.caption, color: colors.textMuted },
  metaValue: { ...typography.caption, color: colors.text, fontWeight: '600' },
  token: { ...typography.h1, color: colors.text, letterSpacing: 1, marginTop: spacing.md },
  tokenHint: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xl },
  primary: {
    alignItems: 'center', alignSelf: 'stretch', backgroundColor: colors.primary,
    borderRadius: radius.md, marginTop: spacing.lg, paddingVertical: spacing.md + 2,
  },
  primaryText: { ...typography.title, color: colors.text, fontSize: 15, fontWeight: '700' },
  secondary: { alignItems: 'center', alignSelf: 'stretch', paddingVertical: spacing.md },
  secondaryText: { ...typography.body, color: colors.textMuted, fontWeight: '600' },
});
