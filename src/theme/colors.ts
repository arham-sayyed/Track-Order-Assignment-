/**
 * Palette derived from the Figma proto + cart reference (PVR INOX F&B).
 * Brand is a golden yellow with a warm cream accent; CTAs are yellow with
 * near-black text.
 */
export const colors = {
  background: '#FFFFFF',
  surface: '#F7F7F8',
  border: '#ECECEC',
  divider: '#F1F1F1',

  text: '#1A1A1A',
  textMuted: '#8A8A8E',

  /** Brand gold — Proceed button, active stepper. */
  primary: '#F5C518',
  /** Darker gold — borders on yellow surfaces, pressed state. */
  primaryEdge: '#E0AC0B',
  /** Soft yellow — "Add" button fill. */
  primarySoft: '#FEF4D6',
  /** Warm cream — cart summary bar. */
  cream: '#FBEBD2',

  veg: '#1BA672',
  nonVeg: '#E23744',

  /** Savings green — struck-MRP discount tag, order-placed check. */
  success: '#2E7D32',
  /** Soft green — discount tag fill. */
  successSoft: '#E8F5E9',

  overlay: 'rgba(0, 0, 0, 0.4)',
  white: '#FFFFFF',
} as const;
