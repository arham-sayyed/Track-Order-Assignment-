import { FlatList, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderCard } from '../../components/orders/OrderCard';
import { Toolbar } from '../../components/Toolbar';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { selectOrders } from '../../selectors/orderSelectors';
import { useAppSelector } from '../../store/hooks';
import { spacing } from '../../theme';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

export function OrdersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const orders = useAppSelector(selectOrders);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toolbar title="Your orders" onBack={() => navigation.goBack()} />
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderStatus', { orderId: item.id })}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
      />
    </View>
  );
}
