import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { COLORS, STATUS_COLORS } from '../constants/config';
import {
  getAttendancePercent,
  getAttendanceStatus,
  getAttendanceAdvice,
} from '../utils/calculations';

// Summary of one course: name, attendance bar, status badge and skip/recover advice.
// Optional: `onPresent` / `onAbsent` show attendance buttons; `feedback` highlights the card.
export default function CourseCard({ course, onPress, onPresent, onAbsent, feedback }) {
  const percent = getAttendancePercent(course.attended, course.total);
  const status = getAttendanceStatus(percent);

  return (
    <Card onPress={onPress} style={feedback ? styles.highlight : null}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.code}>{course.code}</Text>
          <Text style={styles.name}>{course.name}</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <ProgressBar percent={percent} color={STATUS_COLORS[status]} />

      <View style={styles.bottomRow}>
        <Text style={styles.meta}>
          {course.attended}/{course.total} classes
        </Text>
        <Text style={[styles.percent, { color: STATUS_COLORS[status] }]}>
          {percent.toFixed(1)}%
        </Text>
      </View>

      <Text style={styles.advice}>{getAttendanceAdvice(course.attended, course.total)}</Text>

      {/* Attendance buttons (only on the Attendance Planner) */}
      {onPresent ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.markButton, styles.presentButton]} onPress={onPresent}>
            <Text style={[styles.markText, { color: COLORS.safe }]}>✓ Present</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.markButton, styles.absentButton]} onPress={onAbsent}>
            <Text style={[styles.markText, { color: COLORS.danger }]}>✗ Absent</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleBlock: {
    flex: 1,
    marginRight: 8,
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  percent: {
    fontSize: 13,
    fontWeight: '700',
  },
  advice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  highlight: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  markButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: COLORS.safeLight,
  },
  absentButton: {
    backgroundColor: COLORS.dangerLight,
  },
  markText: {
    fontSize: 14,
    fontWeight: '700',
  },
  feedback: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
});
