import { StyleSheet, View } from 'react-native';
import { FoodType } from '../../types/fnb';
import { colors } from '../../theme';

export interface VegNonVegBadgeProps {
  type: FoodType;
  size?: number;
}

/** Standard square-outline + dot marker. Green = veg, red = non-veg. */
export function VegNonVegBadge({ type, size = 14 }: VegNonVegBadgeProps) {
  const color = type === 'VEG' ? colors.veg : colors.nonVeg;
  return (
    <View style={[styles.box, { width: size, height: size, borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color, width: size / 2, height: size / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  dot: { borderRadius: 999 },
});
