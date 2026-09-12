import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { formatAmount } from '../../utils/format';
import { colors } from '../../theme';
import { selectOrderById } from '../../selectors/orderSelectors';
import { useAppSelector } from '../../store/hooks';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmation'>;

export function OrderConfirmationScreen({ route, navigation }: Props) {
  const order = useAppSelector(selectOrderById(route.params.orderId));

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.check}>
        <Ionicons name="checkmark-sharp" size={34} color={colors.white} />
      </View>
      <Text style={styles.title}>Payment successful</Text>
      <Text style={styles.amount}>{formatAmount(order.bill.total)}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Order</Text>
        <Text style={styles.metaValue}>{order.id}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Payment</Text>
        <Text style={styles.metaValue}>
          {order.payment.paymentId} · {order.payment.method.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.token}>{order.token}</Text>
      <Text style={styles.tokenHint}>Show this token at the F&B counter</Text>

      <Pressable
        style={styles.primary}
        onPress={() => navigation.replace('OrderStatus', { orderId: order.id })}
        accessibilityRole="button"
      >
        <Text style={styles.primaryText}>Track my order</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.popToTop()} accessibilityRole="button">
        <Text style={styles.secondaryText}>Back to menu</Text>
      </Pressable>
    </View>
  );
}
