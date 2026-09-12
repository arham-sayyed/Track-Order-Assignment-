# INOX F&B — Track Order (React Native CLI)

Assignment implementation: sticky-toolbar F&B ordering screen with a horizontal
"repeat" list, horizontally-scrolling sticky filters, a vertical main food list,
and a bottom-sheet cart — all quantity state kept in sync across the three lists.

- **Figma:** https://www.figma.com/proto/3A4XqzGzHJYmkpTgRNDi9g/INOX-F-B-Track-Order?node-id=3452-1285
- **Data:** `assets/data/fnb.json` (`listOfFnbItems`)

## Stack

React Native CLI · React Native 0.86 · TypeScript · Redux Toolkit · React Navigation
(native-stack) · `@gorhom/bottom-sheet` (Reanimated 4 + Gesture Handler) ·
AsyncStorage (order-history persistence) · Razorpay (`react-native-razorpay` +
a local Express backend for order creation/signature verification).

## Run

```bash
npm install
cp .env.example .env        # then set RAZORPAY_KEY_ID once you have a real test key
cd server && npm install && cd ..
cp server/.env.example server/.env   # set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET

# terminal 1 — payments backend
cd server && npm start

# terminal 2 — Metro bundler
npx react-native start

# terminal 3 — Android
npx react-native run-android
```

### Getting a Razorpay test key (first time)

1. Sign up at https://dashboard.razorpay.com/signup (no business verification
   needed for Test Mode).
2. In the dashboard, switch to **Test Mode** (toggle, top left).
3. **Settings → API Keys → Generate Test Key** — this gives you a `key_id`
   (starts `rzp_test_`) and a `key_secret`, shown once.
4. Put the `key_id` in the app's `.env` (`RAZORPAY_KEY_ID`) and *both* values in
   `server/.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) — the secret must
   only ever live on the backend, never in the app bundle.
5. Without a key set, the app falls back to the in-app simulated payment sheet
   automatically — nothing breaks if you skip this.

## Build an APK

```bash
cd android
./gradlew assembleRelease   # -> android/app/build/outputs/apk/release/app-release.apk
# or, for a debug build:
./gradlew assembleDebug
```

## Architecture

```
App.tsx                      Redux + GestureHandler + SafeArea + Navigation providers;
                             mounts <PaymentHost/>; preloads persisted order history
src/
  navigation/RootNavigator   native stack: TrackOrder, Checkout, OrderConfirmation,
                             OrderStatus, Orders
  screens/
    TrackOrderScreen/        composes Toolbar + FoodList(RepeatList, FilterBar) + Cart
    CheckoutScreen/          pickup context + bill (item total, GST 5%, ₹20 fee) + Pay
    OrderConfirmationScreen/ payment id + pickup token; Track order / Back to menu
    OrderStatusScreen/       time-derived stage + OrderStatusStepper (1s tick)
    OrdersScreen/            persisted order history, newest first; row -> status
  components/
    Toolbar                  fixed top bar (outside the scroll list); receipt icon -> Orders
    RepeatList/              horizontal FlatList of isRepeat items
    FilterBar/               horizontal chips, rendered as the sticky header
    FoodList/                the single vertical SectionList (+ sticky-header mechanism)
    cart/                    CheckoutBar (pinned) + CartBottomSheet + CartRow
    payment/                 RazorpaySheet + PaymentAmountHeader + PaymentMethodTabs
    orders/                  OrderStatusStepper + OrderCard
    common/                  QuantityStepper, VegNonVegBadge, Price, FoodImage
  payments/                  gateway interface + factory (index.ts = the one switch point),
                             config (react-native-config env key), simulated + real
                             adapters, ordersApi (backend calls), paymentController
                             bridge, <PaymentHost/> root UI
  store/
    cartSlice                { [itemId]: qty }  <-- SINGLE SOURCE OF TRUTH
    filtersSlice             vegMode + selected categories (combinable)
    ordersSlice              order history (orderPlaced / orderStatusAdvanced)
    persistence              RTK listener middleware -> AsyncStorage (key inox.orders.v1)
    index                    makeStore(preloadedState?) via combineReducers
  selectors/
    fnbSelectors             filtered list, repeat list, cart lines, totals (memoized)
    orderSelectors           selectOrders / selectOrderById
  data/fnbRepository         load + normalize fnb.json -> FnbItem[]
  constants/cinema           fixed cinema context for the order
  types/fnb                  RawFnbItem / FnbItem / CartLine / Category
  types/order                Order / OrderLine / Bill / OrderStatus
  theme/                     colors, spacing, typography tokens
  utils/format               ₹ formatting + discountPercent
  utils/bill                 computeBill — item total + GST + convenience fee
  utils/order                buildOrder + local order-id
  utils/token                makePickupToken — counter pickup token (e.g. "A42")
  utils/status               deriveStage / stageRank / STAGE_ORDER
server/                      Express backend — POST /orders (Razorpay order
                             creation), POST /orders/:orderId/verify (signature
                             check); run locally alongside the app
```

### How list sync works (assignment req. 3–5)

There is no per-list quantity state. `cartSlice.quantities` is keyed by item id.
`QuantityStepper` is the only component that reads/writes it, and all three
lists render that same stepper. Change a quantity anywhere → the slice updates →
every list re-derives from selectors → they all match. The cart bottom sheet is
just another view over the same slice.

## Assignment checklist

- [x] 1. Layout — sticky Toolbar; scrollable Repeat / Filter / Main sections
- [x] 2. Food listing from `fnb.json`; combinable Veg/Non-Veg + category filters
- [x] 3. Cart bottom sheet — name, image, qty, food type, +/− ; reflects everywhere
- [x] 4. Repeat list from `isRepeat: true`; two-way sync with main list & cart
- [x] 5. Main vertical list — name, image, rate, food type; repeat items stay here too
- [x] 6. Sticky filters below the Toolbar while scrolling
- [x] Figma visual pass (PVR INOX gold theme, cream bars, "REPEAT AGAIN?", bottom Proceed bar)
- [x] Discount handling — struck MRP + "N% OFF" tag where `itemOfferRate < itemRate`
- [x] Broken-image fallback — `FoodImage` shows a glyph when the base64 payload is missing/bad
- [x] `Proceed` → Checkout (bill: item total + GST 5% + ₹20 fee) → payment → confirmation → tracking
- [x] Checkout + real Razorpay payment (order creation + signature verification) + order history (AsyncStorage)
- [x] Bare React Native CLI (no Expo)
- [x] Icons — `react-native-vector-icons` (Ionicons / MaterialCommunityIcons)
- [ ] Run on device/emulator and fine-tune spacing against Figma
- [ ] Build APK (`cd android && ./gradlew assembleRelease`)
- [ ] Push to GitHub + share link

## Known follow-ups (not done in this pass)

- **iOS**: `android/`/`ios/` are both generated and native-linked by
  convention, but nothing here has been built or run on iOS (no Mac
  available). `react-native-vector-icons` and `react-native-config` both also
  need a one-time Xcode build-phase step (font resource copy /dotenv run
  script) that can't be done from a text edit — see each package's iOS install
  docs if you build for iOS.
- **iOS app icon**: still the RN CLI placeholder — regenerate via Xcode's
  Image Asset tool from `assets/icon.png` (Android's launcher icon is already
  regenerated at every density from that same source).
- **Payments backend hosting**: `server/` runs locally only; deploy it
  somewhere reachable from a real device before demoing off this machine.

## Status

All six requirements implemented and styled to the reference, now on bare
React Native CLI (no Expo) with real Razorpay checkout. Verified in this
environment: `npm test` (app: 51 tests; server: 7 tests), `tsc --noEmit`,
and `eslint` all pass. Not yet run on a device/emulator — this machine has
no Android SDK or JDK 17, so a native build was not performed here; build
and run on your own machine before resubmitting.

`Proceed` opens the Checkout screen (pickup context + bill: item total, GST 5%,
₹20 convenience fee), then `paymentGateway.open()` creates a Razorpay order via
the local backend, opens the native Razorpay Checkout, and verifies the
payment signature server-side before the order is saved, persisted to
AsyncStorage, and the app moves to confirmation then live order tracking. With
no `RAZORPAY_KEY_ID` set, it falls back to the in-app simulated sheet
(`<PaymentHost/>`) — no backend needed for that path.
