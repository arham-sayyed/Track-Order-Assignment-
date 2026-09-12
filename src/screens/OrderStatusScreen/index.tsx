import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toolbar } from '../../components/Toolbar';
import { OrderStatusStepper } from '../../components/orders/OrderStatusStepper';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { selectOrderById } from '../../selectors/orderSelectors';
import { orderStatusAdvanced } from '../../store/ordersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deriveStage, stageRank, STAGE_ORDER } from '../../utils/status';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderStatus'>;

export function OrderStatusScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrderById(route.params.orderId));
  const [, tick] = useState(0);

  useEffect(() => {
    if (!order) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [order]);

  // Intentionally no dependency array: re-derive the stage on every render, which
  // the 1s `tick` above drives. Advancing the stored status is idempotent.
  useEffect(() => {
    if (!order) return;
    const derived = deriveStage(Date.now() - order.createdAt);
    if (stageRank(derived) > stageRank(order.status)) {
      dispatch(orderStatusAdvanced({ id: order.id, status: derived }));
    }
  });

  if (!order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Toolbar title="Order status" onBack={() => navigation.goBack()} />
        <Text style={styles.notFound}>Order not found</Text>
      </View>
    );
  }

  // Render the time-derived stage on the first frame; the effect above only
  // persists it. Never regress below the stored status. `Date.now()` in render is
  // deliberate — the stage is a function of wall-clock time and the 1s `tick`
  // interval above drives the re-render.
  // eslint-disable-next-line react-hooks/purity
  const elapsedMs = Date.now() - order.createdAt;
  const shownStatus =
    STAGE_ORDER[Math.max(stageRank(order.status), stageRank(deriveStage(elapsedMs)))];
  const ready = shownStatus === 'READY' || shownStatus === 'COLLECTED';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toolbar title="Order status" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View>
          <Text style={styles.heading}>{ready ? 'Ready for pickup' : 'We’re on it'}</Text>
          <Text style={styles.sub}>Order {order.id}</Text>
        </View>

        <OrderStatusStepper status={shownStatus} />

        <View style={styles.tokenCard}>
          <Text style={styles.tokenLabel}>
            {ready ? 'Collect at the counter — token' : 'Your pickup token'}
          </Text>
          <Text style={styles.token}>{order.token}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
