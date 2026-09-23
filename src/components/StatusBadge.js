import { View, Text, StyleSheet } from 'react-native';
import { COLORS, STATUS_COLORS, STATUS_LABELS } from '../constants/config';

// Light background colour behind each status label
const BACKGROUNDS = {
  safe: COLORS.safeLight,
  warning: COLORS.warningLight,
  danger: COLORS.dangerLight,
};

export default function StatusBadge({ status }) {
  return (
    <View style={[styles.badge, { backgroundColor: BACKGROUNDS[status] }]}>
      <Text style={[styles.text, { color: STATUS_COLORS[status] }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
