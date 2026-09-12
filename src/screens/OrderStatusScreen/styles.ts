import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  body: { gap: spacing.xl, padding: spacing.xl },
  heading: { ...typography.h1, color: colors.text },
  sub: { ...typography.body, color: colors.textMuted },
  tokenCard: {
    alignItems: 'center', backgroundColor: colors.cream, borderRadius: radius.md,
    gap: spacing.xs, padding: spacing.lg,
  },
  tokenLabel: { ...typography.caption, color: colors.textMuted },
  token: { ...typography.h1, color: colors.text, letterSpacing: 1 },
  notFound: { ...typography.body, color: colors.textMuted, padding: spacing.xl },
});
