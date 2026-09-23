import { Text, StyleSheet } from 'react-native';
import { COLORS, GRADING_NOTE } from '../constants/config';

// Small italic reminder that grades are estimates (shown on Marks and Course Detail)
export default function GradingNote({ style }) {
  return <Text style={[styles.note, style]}>{GRADING_NOTE}</Text>;
}

const styles = StyleSheet.create({
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textMuted,
  },
});
