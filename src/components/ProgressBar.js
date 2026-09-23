import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

// Horizontal bar filled to `percent` (clamped between 0 and 100)
export default function ProgressBar({ percent, color = COLORS.primary }) {
  const width = Math.min(Math.max(percent, 0), 100);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${width}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
