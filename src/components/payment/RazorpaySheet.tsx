import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PaymentMethod, PaymentOptions } from '../../payments/types';
import { colors, radius, spacing, typography } from '../../theme';
import { PaymentAmountHeader } from './PaymentAmountHeader';
import { PaymentMethodTabs } from './PaymentMethodTabs';

export interface RazorpaySheetProps {
  options: PaymentOptions;
  onPaid: (method: PaymentMethod) => void;
  onDismiss: () => void;
  onFail: () => void;
}

const PROCESSING_MS = 1200;

export function RazorpaySheet({ options, onPaid, onDismiss, onFail }: RazorpaySheetProps) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const pay = () => {
    setProcessing(true);
    timerRef.current = setTimeout(() => onPaid(method), PROCESSING_MS);
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible
      animationType="slide"
      onRequestClose={processing ? undefined : onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={processing ? undefined : onDismiss} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <PaymentAmountHeader name={options.name} amountPaise={options.amount} />
          <View style={styles.body}>
            <Text style={styles.desc}>{options.description}</Text>
            <PaymentMethodTabs value={method} onChange={setMethod} />

            <Pressable
              style={[styles.payButton, processing && styles.payButtonDisabled]}
              onPress={pay}
              disabled={processing}
              accessibilityRole="button"
            >
              {processing ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.payText}>Pay ₹{(options.amount / 100).toFixed(2)}</Text>
              )}
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.link} onPress={processing ? undefined : onDismiss}>
                Cancel
              </Text>
              <Text style={styles.linkMuted} onPress={processing ? undefined : onFail}>
                Simulate failure
              </Text>
            </View>
            <Text style={styles.sim}>Simulated payment — no real charge</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  body: { gap: spacing.md, padding: spacing.lg },
  desc: { ...typography.body, color: colors.textMuted },
  payButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
  },
  payButtonDisabled: { opacity: 0.7 },
  payText: { ...typography.price, color: colors.text },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { ...typography.body, color: colors.text, fontWeight: '600' },
  linkMuted: { ...typography.body, color: colors.textMuted },
  sim: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
