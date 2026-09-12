import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toolbar } from '../../components/Toolbar';
import { CINEMA } from '../../constants/cinema';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { buildOrder } from '../../utils/order';
import { computeBill } from '../../utils/bill';
import { formatAmount } from '../../utils/format';
import { spacing } from '../../theme';
import { paymentGateway, toPaymentOptions } from '../../payments';
import type { PaymentError } from '../../payments';
import { selectCartLines } from '../../selectors/fnbSelectors';
import { clearCart } from '../../store/cartSlice';
import { orderPlaced } from '../../store/ordersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

function messageFor(e: PaymentError): string | null {
  if (e.code === 'PAYMENT_CANCELLED') return null; // user chose to back out — no error UI
  return e.description;
}

export function CheckoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const bill = computeBill(lines);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const disabled = lines.length === 0 || busy;

  const pay = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await paymentGateway.open(toPaymentOptions(bill, lines.length));
      const order = buildOrder({ lines, bill, payment: result });
      dispatch(orderPlaced(order));
      dispatch(clearCart());
      navigation.replace('OrderConfirmation', { orderId: order.id });
    } catch (e) {
      setError(messageFor(e as PaymentError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toolbar title="Checkout" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PICKUP AT</Text>
          <Text style={styles.cinemaLine}>{CINEMA.name}</Text>
          <Text style={styles.rowLabel}>
            {CINEMA.screen} · Seats {CINEMA.seats}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ITEMS</Text>
          {lines.map((l) => (
            <View key={l.item.id} style={styles.row}>
              <Text style={styles.rowLabel}>
                {l.item.name} × {l.qty}
              </Text>
              <Text style={styles.rowValue}>{formatAmount(l.item.price * l.qty)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>BILL</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Item total</Text>
            <Text style={styles.rowValue}>{formatAmount(bill.subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>GST (5%)</Text>
            <Text style={styles.rowValue}>{formatAmount(bill.tax)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Convenience fee</Text>
            <Text style={styles.rowValue}>{formatAmount(bill.convenienceFee)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>To pay</Text>
            <Text style={styles.totalValue}>{formatAmount(bill.total)}</Text>
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          style={[styles.payButton, disabled && styles.payButtonDisabled]}
          onPress={pay}
          disabled={disabled}
          accessibilityRole="button"
        >
          <Text style={styles.payText}>
            {busy ? 'Processing…' : `Pay ${formatAmount(bill.total)}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
