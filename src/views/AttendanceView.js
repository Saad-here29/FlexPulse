import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { COLORS, ATTENDANCE_THRESHOLD } from '../constants/config';
import { getAttendancePercent, getAttendanceStatus } from '../utils/calculations';

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Safe', value: 'safe' },
  { label: 'Warning', value: 'warning' },
  { label: 'At risk', value: 'danger' },
];

export default function AttendanceView({ courses, onBack, onMarkAttendance, onOpenCourse }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lowestFirst, setLowestFirst] = useState(true);
  // The last course marked, so its card can show feedback: { courseId, present }
  const [lastMarked, setLastMarked] = useState(null);

  const query = search.trim().toLowerCase();

  // 1. map: attach the attendance % to each course
  // 2. filter: keep courses matching the search text and the selected status
  const filtered = courses
    .map((course) => ({ course, percent: getAttendancePercent(course.attended, course.total) }))
    .filter(
      (row) =>
        row.course.code.toLowerCase().includes(query) ||
        row.course.name.toLowerCase().includes(query)
    )
    .filter((row) => statusFilter === 'all' || getAttendanceStatus(row.percent) === statusFilter);

  // 3. sort a copy (never sort state directly)
  const sorted = [...filtered].sort((a, b) =>
    lowestFirst ? a.percent - b.percent : b.percent - a.percent
  );

  // Update attendance in App.js, then remember which card to highlight
  const handleMark = (courseId, present) => {
    onMarkAttendance(courseId, present);
    setLastMarked({ courseId, present });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  // Feedback text for a card, or null if it was not the last one marked
  const getFeedback = (courseId) => {
    if (!lastMarked || lastMarked.courseId !== courseId) return null;
    return lastMarked.present ? '✓ Marked present' : '✗ Marked absent';
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenHeader
        title="Attendance Planner"
        subtitle={`Stay at or above ${ATTENDANCE_THRESHOLD}% in every course`}
        onBack={onBack}
      />

      <View style={styles.body}>
        {courses.length === 0 ? (
          <EmptyState title="No courses yet" message="Add a course from the Home screen." />
        ) : (
          <>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Search by code or name" />
            <FilterChips options={FILTER_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} />

            {/* Result count + sort toggle */}
            <View style={styles.toolbar}>
              <Text style={styles.count}>
                {sorted.length} of {courses.length} courses
              </Text>
              <TouchableOpacity onPress={() => setLowestFirst(!lowestFirst)}>
                <Text style={styles.sort}>{lowestFirst ? 'Lowest first ↑' : 'Highest first ↓'}</Text>
              </TouchableOpacity>
            </View>

            {sorted.length === 0 ? (
              <EmptyState
                title="No matching courses"
                message="Try a different search or filter."
                actionTitle="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              sorted.map(({ course }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => onOpenCourse(course.id)}
                  onPresent={() => handleMark(course.id, true)}
                  onAbsent={() => handleMark(course.id, false)}
                  feedback={getFeedback(course.id)}
                />
              ))
            )}
          </>
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  count: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  sort: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
