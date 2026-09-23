import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { COLORS, STATUS_COLORS } from '../constants/config';
import {
  getAttendancePercent,
  getAttendanceStatus,
  getAttendanceAdvice,
} from '../utils/calculations';

// Summary of one course: name, attendance bar, status badge and skip/recover advice
export default function CourseCard({ course, onPress }) {
  const percent = getAttendancePercent(course.attended, course.total);
  const status = getAttendanceStatus(percent);

  return (
    <Card onPress={onPress}>
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
});
