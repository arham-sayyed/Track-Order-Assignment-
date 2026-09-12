import { StyleSheet, Text, View } from 'react-native';
import type { OrderStatus } from '../../types/order';
import { stageRank } from '../../utils/status';
import { colors, radius, spacing, typography } from '../../theme';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PLACED', label: 'Order placed' },
  { status: 'PREPARING', label: 'Preparing' },
  { status: 'READY', label: 'Ready for pickup' },
];

export interface OrderStatusStepperProps {
  status: OrderStatus;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  const current = stageRank(status);
  return (
    <View style={styles.root}>
      {STEPS.map((step) => {
        const done = current >= stageRank(step.status);
        return (
          <View key={step.status} style={styles.row} accessibilityState={{ selected: done }}>
            <View style={[styles.dot, done && styles.dotDone]} />
            <Text style={[styles.label, done && styles.labelDone]}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  dot: {
    backgroundColor: colors.border, borderRadius: radius.pill, height: 16, width: 16,
  },
  dotDone: { backgroundColor: colors.success },
  label: { ...typography.body, color: colors.textMuted },
  labelDone: { color: colors.text, fontWeight: '600' },
});
