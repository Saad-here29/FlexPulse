import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import GradingNote from '../components/GradingNote';
import {
  COLORS,
  STATUS_COLORS,
  GRADE_SCALE,
  DEFAULT_TARGET_GRADE,
} from '../constants/config';
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
import { validateMarks } from '../utils/validation';

// Target grade chips built from GRADE_SCALE, leaving out the failing grade (0 points)
const GRADE_OPTIONS = GRADE_SCALE.filter((g) => g.points > 0).map((g) => ({
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

export default function CourseDetailView({ course, onBack, onUpdateMarks }) {
  const [targetGrade, setTargetGrade] = useState(DEFAULT_TARGET_GRADE);
  // Index of the assessment being edited (only one at a time), or null
  const [editingIndex, setEditingIndex] = useState(null);
  // Text typed in the marks editor
  const [draft, setDraft] = useState('');

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

  // ----- Marks editor -----

  // Open the editor for one row, pre-filled with its current marks.
  // Tapping the row that is already open closes it instead.
  const startEditing = (index) => {
    if (index === editingIndex) {
      setEditingIndex(null);
      return;
    }
    const obtained = course.assessments[index].obtained;
    setEditingIndex(index);
    setDraft(obtained === null ? '' : String(obtained));
  };
  const stopEditing = () => setEditingIndex(null);

  // Save or clear the marks in App.js (null = back to Pending), then close the editor
  const saveMarks = () => {
    onUpdateMarks(course.id, editingIndex, Number(draft));
    stopEditing();
  };
  const clearMarks = () => {
    onUpdateMarks(course.id, editingIndex, null);
    stopEditing();
  };

  // Error for the typed marks (null when valid or when nothing is being edited)
  const draftError =
    editingIndex === null ? null : validateMarks(draft, course.assessments[editingIndex].outOf);

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
          <Text style={styles.muted}>Tap an assessment to enter or edit its marks.</Text>
          {course.assessments.map((a, index) => (
            <View key={a.name}>
              <TouchableOpacity
                style={[styles.assessmentRow, editingIndex === index && styles.assessmentRowActive]}
                onPress={() => startEditing(index)}
              >
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
              </TouchableOpacity>

              {/* Inline editor, shown only under the row being edited */}
              {editingIndex === index ? (
                <View style={styles.editor}>
                  <FormField
                    label={`Marks out of ${a.outOf}`}
                    placeholder="e.g. 17.5"
                    value={draft}
                    onChangeText={setDraft}
                    // Don't show "Enter the marks" in red before the user has typed anything
                    error={draft === '' ? null : draftError}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                  <View style={styles.editorButtons}>
                    <PrimaryButton title="Save" onPress={saveMarks} disabled={draftError !== null} style={styles.editorButton} />
                    <PrimaryButton title="Clear" outline onPress={clearMarks} style={styles.editorButton} />
                    <PrimaryButton title="Cancel" outline onPress={stopEditing} style={styles.editorButton} />
                  </View>
                </View>
              ) : null}
            </View>
          ))}
          <Text style={styles.summary}>
            {scorePercent === null
              ? 'No marks entered yet'
              : `Score so far: ${score.toFixed(1)} / ${gradedWeight} → ${scorePercent.toFixed(1)}% (${getGrade(scorePercent)})`}
          </Text>
          <GradingNote style={styles.note} />
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
  assessmentRowActive: {
    backgroundColor: COLORS.primaryLight,
  },
  editor: {
    paddingVertical: 12,
  },
  editorButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editorButton: {
    flex: 1,
    paddingVertical: 10,
  },
  note: {
    marginTop: 6,
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
