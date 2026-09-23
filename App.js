import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import initialCourses from './src/data/courses';
import { COLORS } from './src/constants/config';
import HomeView from './src/views/HomeView';
import AttendanceView from './src/views/AttendanceView';
import MarksView from './src/views/MarksView';
import AddCourseView from './src/views/AddCourseView';
import CourseDetailView from './src/views/CourseDetailView';

export default function App() {
  // All course data lives here and is passed down to views as props
  const [courses, setCourses] = useState(initialCourses);

  // Which screen is showing: 'home' | 'attendance' | 'marks' | 'addCourse' | 'courseDetail'
  const [currentView, setCurrentView] = useState('home');

  // Which course CourseDetailView should show
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // The view that opened CourseDetailView, so Back can return there
  const [previousView, setPreviousView] = useState('home');

  // Success message shown on Home (e.g. after adding a course)
  const [notice, setNotice] = useState(null);

  // ----- Handlers passed to views -----

  // Switch view and clear any old success message
  const changeView = (view) => {
    setNotice(null);
    setCurrentView(view);
  };

  const goHome = () => changeView('home');

  // Remember where we came from (Home, Attendance or Marks), then open the course
  const openCourse = (courseId) => {
    setPreviousView(currentView);
    setSelectedCourseId(courseId);
    changeView('courseDetail');
  };

  // Back from CourseDetailView returns to the view that opened it
  const goBackFromCourse = () => changeView(previousView);

  // Adds a course (unique id from the timestamp), then shows a success message on Home
  const addCourse = (newCourse) => {
    setCourses([...courses, { ...newCourse, id: Date.now().toString() }]);
    setCurrentView('home');
    setNotice(`${newCourse.code} added successfully`);
  };

  // Present: attended + 1 and total + 1. Absent: only total + 1.
  // .map returns a new array with a new object for the changed course (state is never mutated).
  const markAttendance = (courseId, present) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, attended: course.attended + (present ? 1 : 0), total: course.total + 1 }
          : course
      )
    );
  };

  // Set the marks of one assessment (null = Pending). Nested .map copies only the
  // changed course and the changed assessment, so state is never mutated.
  const updateAssessmentMarks = (courseId, assessmentIndex, obtained) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assessments: course.assessments.map((a, i) =>
                i === assessmentIndex ? { ...a, obtained } : a
              ),
            }
          : course
      )
    );
  };

  // Conditional rendering: pick the view to show based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'attendance':
        return (
          <AttendanceView
            courses={courses}
            onBack={goHome}
            onMarkAttendance={markAttendance}
            onOpenCourse={openCourse}
          />
        );
      case 'marks':
        return <MarksView courses={courses} onBack={goHome} onOpenCourse={openCourse} />;
      case 'addCourse':
        return <AddCourseView courses={courses} onAddCourse={addCourse} onBack={goHome} />;
      case 'courseDetail':
        return (
          <CourseDetailView
            course={courses.find((c) => c.id === selectedCourseId)}
            onBack={goBackFromCourse}
            onUpdateMarks={updateAssessmentMarks}
          />
        );
      default:
        return (
          <HomeView
            courses={courses}
            notice={notice}
            onDismissNotice={() => setNotice(null)}
            onNavigate={changeView}
            onOpenCourse={openCourse}
          />
        );
    }
  };

  // SafeAreaProvider measures the notch / status bar; SafeAreaView keeps content
  // clear of them on both iOS and Android
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {renderView()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
