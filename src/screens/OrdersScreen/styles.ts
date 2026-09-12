import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  list: { gap: spacing.md, padding: spacing.lg },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    padding: spacing.xxl,
    textAlign: 'center',
  },
});
