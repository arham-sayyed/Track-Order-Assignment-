import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Order } from '../../types/order';
import { formatAmount } from '../../utils/format';
import { deriveStage, stageRank, STAGE_ORDER } from '../../utils/status';
import { colors, radius, spacing, typography } from '../../theme';

export interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const STATUS_LABEL: Record<Order['status'], string> = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COLLECTED: 'Collected',
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const when = new Date(order.createdAt);
  // Show the later of the stored status and the time-derived stage, so the list
  // pill is never stale for an order whose tracking screen hasn't been opened.
  // `Date.now()` in render is deliberate (stage is a function of wall-clock time);
  // the card re-derives when the list is re-entered or the store changes.
  // eslint-disable-next-line react-hooks/purity
  const elapsedMs = Date.now() - order.createdAt;
  const shownStatus =
    STAGE_ORDER[Math.max(stageRank(order.status), stageRank(deriveStage(elapsedMs)))];
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.rowBetween}>
        <Text style={styles.id}>{order.id}</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{STATUS_LABEL[shownStatus]}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {when.toLocaleDateString()} {when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {'  ·  '}
        {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}
        {'  ·  '}
        {formatAmount(order.bill.total)}
      </Text>
      <Text style={styles.token}>Token {order.token}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  rowBetween: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  id: { ...typography.title, color: colors.text, fontSize: 14 },
  pill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  pillText: { ...typography.caption, color: colors.text, fontWeight: '700' },
  meta: { ...typography.caption, color: colors.textMuted },
  token: { ...typography.caption, color: colors.text, fontWeight: '600' },
});
