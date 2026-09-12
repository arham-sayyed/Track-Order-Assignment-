import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export interface PaymentAmountHeaderProps {
  name: string;
  amountPaise: number;
}

export function PaymentAmountHeader({ name, amountPaise }: PaymentAmountHeaderProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.merchant}>{name}</Text>
      <Text style={styles.amount}>₹{(amountPaise / 100).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.text,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  merchant: { ...typography.caption, color: colors.white },
  amount: { ...typography.h1, color: colors.white },
});
