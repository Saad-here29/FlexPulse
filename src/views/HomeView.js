import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import {
  COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  CHART_CONFIG,
  ATTENDANCE_THRESHOLD,
} from '../constants/config';
import {
  getAttendancePercent,
  getAttendanceStatus,
  getAttendanceAdvice,
  getScorePercent,
  getGradePoints,
} from '../utils/calculations';

// Action cards on the dashboard. `view` is the currentView value App.js switches to.
const ACTIONS = [
  { view: 'attendance', icon: '📅', title: 'Attendance Planner', description: 'See how many classes you can still miss' },
  { view: 'marks', icon: '📊', title: 'Marks & Final Calculator', description: 'Find out what you need in the final' },
  { view: 'addCourse', icon: '➕', title: 'Add Course', description: 'Track a new course this semester' },
];

// Greeting based on the time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeView({ courses, onNavigate, onOpenCourse }) {
  // No courses yet: show only the greeting and a button to add one
  if (courses.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={getGreeting()} subtitle="Welcome to FLEX Pulse" />
        <EmptyState
          title="No courses yet"
          message="Add your first course to see your attendance and marks dashboard."
          actionTitle="Add a Course"
          onAction={() => onNavigate('addCourse')}
        />
      </ScrollView>
    );
  }

  // ----- Everything below is recalculated on every render, so it updates when `courses` changes -----

  // Work out percent, status and score once per course (map)
  const courseStats = courses.map((course) => {
    const percent = getAttendancePercent(course.attended, course.total);
    return {
      course,
      percent,
      status: getAttendanceStatus(percent),
      score: getScorePercent(course.assessments), // null if nothing graded yet
    };
  });

  // Overall attendance = all classes attended / all classes held (reduce)
  const totalAttended = courses.reduce((sum, c) => sum + c.attended, 0);
  const totalClasses = courses.reduce((sum, c) => sum + c.total, 0);
  const overallAttendance = getAttendancePercent(totalAttended, totalClasses);

  // Courses below the threshold (filter)
  const dangerCourses = courseStats.filter((s) => s.status === 'danger');
  const warningCourses = courseStats.filter((s) => s.status === 'warning');

  // Estimated GPA = sum(grade points x credit hours) / sum(credit hours), graded courses only
  const gradedCourses = courseStats.filter((s) => s.score !== null);
  const gradedCredits = gradedCourses.reduce((sum, s) => sum + s.course.creditHours, 0);
  const gradePoints = gradedCourses.reduce(
    (sum, s) => sum + getGradePoints(s.score) * s.course.creditHours,
    0
  );
  const estimatedGPA = gradedCredits > 0 ? gradePoints / gradedCredits : null;

  // ----- Chart data -----

  // Chart width = screen width minus screen padding (20 x 2) and card padding (16 x 2)
  const chartWidth = Dimensions.get('window').width - 72;

  // 1. Bar chart: attendance % per course, each bar coloured by its status
  const barData = {
    labels: courseStats.map((s) => s.course.code),
    datasets: [
      {
        data: courseStats.map((s) => s.percent),
        colors: courseStats.map((s) => () => STATUS_COLORS[s.status]),
      },
    ],
  };

  // 2. Pie chart: how many courses are in each status (empty slices are left out)
  const pieData = ['safe', 'warning', 'danger']
    .map((status) => ({
      name: STATUS_LABELS[status],
      count: courseStats.filter((s) => s.status === status).length,
      color: STATUS_COLORS[status],
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    }))
    .filter((slice) => slice.count > 0);

  // 3. Progress chart: score % for up to 4 graded courses (values must be between 0 and 1)
  const progressCourses = gradedCourses.slice(0, 4);
  const progressData = {
    labels: progressCourses.map((s) => s.course.code),
    data: progressCourses.map((s) => Math.min(Math.max(s.score / 100, 0), 1)),
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title={getGreeting()} subtitle="Here's how your semester is going" />

      <View style={styles.body}>
        {/* Summary stat cards */}
        <View style={styles.statRow}>
          <StatCard label="Attendance" value={`${overallAttendance.toFixed(1)}%`} />
          <StatCard label="At Risk" value={dangerCourses.length} color={dangerCourses.length > 0 ? COLORS.danger : COLORS.safe} />
          <StatCard label="Est. GPA" value={estimatedGPA === null ? '–' : estimatedGPA.toFixed(2)} />
        </View>

        {/* Alert banner: red list of at-risk courses, or a positive message */}
        {dangerCourses.length > 0 ? (
          <View style={[styles.banner, styles.bannerDanger]}>
            <Text style={[styles.bannerTitle, { color: COLORS.danger }]}>
              ⚠️ {dangerCourses.length} course{dangerCourses.length === 1 ? '' : 's'} below {ATTENDANCE_THRESHOLD}% attendance
            </Text>
            {dangerCourses.map((s) => (
              <TouchableOpacity key={s.course.id} style={styles.bannerRow} onPress={() => onOpenCourse(s.course.id)}>
                <Text style={styles.bannerCourse}>
                  {s.course.code} · {s.course.name} ({s.percent.toFixed(1)}%)
                </Text>
                <Text style={styles.bannerAdvice}>
                  {getAttendanceAdvice(s.course.attended, s.course.total)} ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[styles.banner, styles.bannerSafe]}>
            <Text style={[styles.bannerTitle, { color: COLORS.safe }]}>
              ✅ All courses are at or above {ATTENDANCE_THRESHOLD}% attendance
            </Text>
          </View>
        )}

        {/* Action cards: each one switches the view in App.js */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        {ACTIONS.map((action) => (
          <Card key={action.view} onPress={() => onNavigate(action.view)} style={styles.actionCard}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{action.icon}</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        ))}

        {/* Warning courses only - danger courses are already in the banner above */}
        {warningCourses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Close to the limit</Text>
            {warningCourses.map((s) => (
              <CourseCard key={s.course.id} course={s.course} onPress={() => onOpenCourse(s.course.id)} />
            ))}
          </>
        )}

        {/* Charts */}
        <Text style={styles.sectionTitle}>Insights</Text>

        <ChartCard title="Attendance by course" description={`Attendance % per course. Stay above ${ATTENDANCE_THRESHOLD}%.`}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={220}
            chartConfig={CHART_CONFIG}
            yAxisSuffix="%"
            fromZero
            fromNumber={100}
            withCustomBarColorFromData
            flatColor
            showBarTops={false}
            style={styles.chart}
          />
        </ChartCard>

        <ChartCard title="Course status" description="How many courses are safe, close to the limit, or at risk.">
          <PieChart
            data={pieData}
            width={chartWidth}
            height={180}
            chartConfig={CHART_CONFIG}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </ChartCard>

        <ChartCard title="Current scores" description="Marks earned so far as a % of graded work (up to 4 courses).">
          {progressCourses.length === 0 ? (
            <EmptyState title="No marks entered yet" />
          ) : (
            <ProgressChart
              data={progressData}
              width={chartWidth}
              height={200}
              strokeWidth={12}
              radius={28}
              chartConfig={CHART_CONFIG}
              hideLegend={false}
            />
          )}
        </ChartCard>
      </View>
    </ScrollView>
  );
}

// Small stat card used in the summary row
function StatCard({ label, value, color = COLORS.primary }) {
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  bannerDanger: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  bannerSafe: {
    backgroundColor: COLORS.safeLight,
    borderColor: COLORS.safe,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  bannerRow: {
    marginTop: 12,
  },
  bannerCourse: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  bannerAdvice: {
    fontSize: 13,
    color: COLORS.danger,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 20,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  chart: {
    marginLeft: -8,
  },
});
