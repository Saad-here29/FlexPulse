import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { COLORS, GRADING_NOTE } from '../constants/config';
import { getScorePercent, getGrade, getGradePoints } from '../utils/calculations';

export default function MarksView({ courses, onBack, onOpenCourse }) {
  // Attach each course's score % (null = no marks yet)
  const rows = courses.map((course) => ({ course, score: getScorePercent(course.assessments) }));

  // Sort a copy: lowest score first so weak courses stand out; courses without marks go last
  const sorted = [...rows].sort((a, b) => {
    if (a.score === null && b.score === null) return 0;
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return a.score - b.score;
  });

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Marks & Final Calculator" subtitle="Lowest score first. Tap a course to plan your final." onBack={onBack} />

      <View style={styles.body}>
        <Text style={styles.note}>{GRADING_NOTE}</Text>
        {sorted.length === 0 ? (
          <EmptyState title="No courses yet" message="Add a course from the Home screen." />
        ) : (
          sorted.map(({ course, score }) => {
            const grade = score === null ? '–' : getGrade(score);
            // Failing courses (0 grade points) are shown in red
            const color = score !== null && getGradePoints(score) === 0 ? COLORS.danger : COLORS.primary;

            return (
              <Card key={course.id} onPress={() => onOpenCourse(course.id)}>
                <View style={styles.row}>
                  <View style={styles.info}>
                    <Text style={styles.code}>{course.code}</Text>
                    <Text style={styles.name}>{course.name}</Text>
                    <Text style={styles.meta}>{course.creditHours} credit hours</Text>
                  </View>
                  <View style={styles.scoreBlock}>
                    <Text style={[styles.grade, { color }]}>{grade}</Text>
                    <Text style={styles.meta}>{score === null ? 'No marks yet' : `${score.toFixed(1)}%`}</Text>
                  </View>
                </View>
                <ProgressBar percent={score === null ? 0 : score} color={color} />
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
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
  meta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scoreBlock: {
    alignItems: 'flex-end',
  },
  grade: {
    fontSize: 26,
    fontWeight: '700',
  },
});
