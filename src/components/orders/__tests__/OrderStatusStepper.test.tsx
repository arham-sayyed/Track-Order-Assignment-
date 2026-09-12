import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { OrderStatusStepper } from '../OrderStatusStepper';
import { colors } from '../../../theme';

// RNTL 13 dropped the `toHaveAccessibilityState` matcher, so assert on the
// rendered label colour instead: done steps use `colors.text`, pending steps
// `colors.textMuted`.
const labelColor = (text: string): unknown =>
  StyleSheet.flatten(screen.getByText(text).props.style).color;

it('marks steps up to and including the current status as done', () => {
  render(<OrderStatusStepper status="PREPARING" />);
  expect(labelColor('Order placed')).toBe(colors.text);
  expect(labelColor('Preparing')).toBe(colors.text);
  expect(labelColor('Ready for pickup')).toBe(colors.textMuted);
});
