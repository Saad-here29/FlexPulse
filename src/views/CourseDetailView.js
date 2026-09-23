import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import { COLORS, STATUS_COLORS, GRADE_SCALE } from '../constants/config';
import {
  getAttendancePercent,
  getAttendanceStatus,
  getAttendanceAdvice,
  getCurrentScore,
  getGradedWeight,
  getScorePercent,
  getGrade,
  getRequiredFinalScore,
} from '../utils/calculations';

// Target grade chips: every grade except F
const GRADE_OPTIONS = GRADE_SCALE.filter((g) => g.grade !== 'F').map((g) => ({
  label: g.grade,
  value: g.grade,
}));

// Message + colour for "what do I need for this grade?"
function getTargetMessage(assessments, target) {
  const needed = getRequiredFinalScore(assessments, target.min);

  if (needed === null) {
    return { color: COLORS.textMuted, text: 'All marks entered. There are no remaining assessments.' };
  }
  if (needed <= 0) {
    return { color: COLORS.safe, text: `Already secured! You get at least ${target.grade} even with 0 in the remaining work.` };
  }
  if (needed > 100) {
    return { color: COLORS.danger, text: `Not possible. You would need ${needed.toFixed(1)}% but the maximum is 100%.` };
  }
  return { color: COLORS.primary, text: `Achievable. Score at least ${needed.toFixed(1)}% in the remaining assessments.` };
}

export default function CourseDetailView({ course, onBack }) {
  const [targetGrade, setTargetGrade] = useState('B');

  // The course may have been removed while this view was open
  if (!course) {
    return (
      <View>
        <ScreenHeader title="Course not found" onBack={onBack} />
        <EmptyState
          title="This course no longer exists"
          actionTitle="Go Back"
          onAction={onBack}
        />
      </View>
    );
  }

  const percent = getAttendancePercent(course.attended, course.total);
  const status = getAttendanceStatus(percent);

  const score = getCurrentScore(course.assessments);
  const scorePercent = getScorePercent(course.assessments); // null if nothing graded yet
  const gradedWeight = getGradedWeight(course.assessments);

  const target = GRADE_SCALE.find((g) => g.grade === targetGrade);
  const message = getTargetMessage(course.assessments, target);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title={course.code} subtitle={course.name} onBack={onBack} />

      <View style={styles.body}>
        {/* Course info */}
        <Card>
          <InfoRow label="Instructor" value={course.instructor} />
          <InfoRow label="Credit hours" value={String(course.creditHours)} />
        </Card>

        {/* Attendance summary */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Attendance</Text>
            <StatusBadge status={status} />
          </View>
          <Text style={[styles.bigNumber, { color: STATUS_COLORS[status] }]}>{percent.toFixed(1)}%</Text>
          <ProgressBar percent={percent} color={STATUS_COLORS[status]} />
          <Text style={styles.muted}>
            {course.attended} of {course.total} classes attended
          </Text>
          <Text style={styles.advice}>{getAttendanceAdvice(course.attended, course.total)}</Text>
        </Card>

        {/* Assessments */}
        <Card>
          <Text style={styles.cardTitle}>Assessments</Text>
          {course.assessments.map((a) => (
            <View key={a.name} style={styles.assessmentRow}>
              <Text style={styles.assessmentName}>
                {a.name} <Text style={styles.muted}>({a.weight}%)</Text>
              </Text>
              {a.obtained === null ? (
                <Text style={styles.pending}>Pending</Text>
              ) : (
                <Text style={styles.assessmentMarks}>
                  {a.obtained}/{a.outOf}
                </Text>
              )}
            </View>
          ))}
          <Text style={styles.summary}>
            {scorePercent === null
              ? 'No marks entered yet'
              : `Score so far: ${score.toFixed(1)} / ${gradedWeight} → ${scorePercent.toFixed(1)}% (${getGrade(scorePercent)})`}
          </Text>
        </Card>

        {/* Target grade calculator */}
        <Card>
          <Text style={styles.cardTitle}>What do I need?</Text>
          <Text style={styles.muted}>Pick a target grade:</Text>
          <View style={styles.chips}>
            <FilterChips options={GRADE_OPTIONS} selected={targetGrade} onSelect={setTargetGrade} />
          </View>
          <Text style={[styles.targetMessage, { color: message.color }]}>{message.text}</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

// One "label: value" line in the info card
function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  muted: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  advice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  assessmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  assessmentName: {
    fontSize: 14,
    color: COLORS.text,
  },
  assessmentMarks: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  pending: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
  },
  summary: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  chips: {
    marginTop: 10,
  },
  targetMessage: {
    fontSize: 15,
    fontWeight: '600',
  },
});
