import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartBottomSheet } from '../../components/cart/CartBottomSheet';
import { CheckoutBar } from '../../components/cart/CheckoutBar';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { FoodList } from '../../components/FoodList/FoodList';
import { RepeatList } from '../../components/RepeatList/RepeatList';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Toolbar } from '../../components/Toolbar';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { selectCartCount } from '../../selectors/fnbSelectors';
import { setQuery } from '../../store/filtersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TrackOrder'>;

/**
 * Track Order screen — the whole layout (requirement 1):
 *
 *   Toolbar                     fixed, never scrolls
 *   SearchBar                   fixed, shown only while the search icon is on
 *   ┌─ FoodList (one SectionList) ────────────────────┐
 *   │   RepeatList   (scroll-away header, horizontal)  │
 *   │   FilterBar    (STICKY section header)           │
 *   │   FoodItemCard rows (vertical, filtered)         │
 *   └─────────────────────────────────────────────────┘
 *   CheckoutBar                 pinned bottom (cart summary + Proceed)
 *   CartBottomSheet             slides up when the summary strip is tapped
 *
 * Quantity state lives entirely in `cartSlice`, so the three lists stay in
 * sync (requirements 3–5) without this screen wiring anything together.
 * "Proceed" hands off to the Checkout screen.
 */
export function TrackOrderScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const cartRef = useRef<BottomSheet>(null);

  const units = useAppSelector(selectCartCount);
  const query = useAppSelector((s) => s.filters.query);
  const [searchOpen, setSearchOpen] = useState(false);

  const openCart = useCallback(() => cartRef.current?.expand(), []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((open) => {
      if (open) dispatch(setQuery('')); // closing clears the query
      return !open;
    });
  }, [dispatch]);

  const clearSearch = useCallback(() => dispatch(setQuery('')), [dispatch]);

  const goToCheckout = useCallback(() => {
    if (units === 0) return;
    cartRef.current?.close();
    navigation.navigate('Checkout');
  }, [navigation, units]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toolbar
        title="Order Snacks"
        location="PVR Plaza, New Delhi"
        onSearch={toggleSearch}
        onOrders={() => navigation.navigate('Orders')}
      />

      {searchOpen && (
        <SearchBar
          value={query}
          onChangeText={(t) => dispatch(setQuery(t))}
          onClear={clearSearch}
        />
      )}

      <View style={styles.body}>
        <FoodList
          scrollAwayHeader={<RepeatList />}
          stickyHeader={<FilterBar />}
          bottomInset={140}
        />
      </View>

      <CheckoutBar onOpenCart={openCart} onProceed={goToCheckout} bottomInset={insets.bottom} />
      <CartBottomSheet ref={cartRef} onProceed={goToCheckout} />
    </View>
  );
}
