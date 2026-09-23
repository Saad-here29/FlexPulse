import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import initialCourses from './src/data/courses';
import { COLORS } from './src/constants/config';
import HomeView from './src/views/HomeView';
import ScreenHeader from './src/components/ScreenHeader';
import EmptyState from './src/components/EmptyState';

export default function App() {
  // All course data lives here and is passed down to views as props
  const [courses, setCourses] = useState(initialCourses);

  // Which screen is showing: 'home' | 'attendance' | 'marks' | 'addCourse' | 'courseDetail'
  const [currentView, setCurrentView] = useState('home');

  // Which course CourseDetailView should show
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // The view that opened CourseDetailView, so Back can return there
  const [previousView, setPreviousView] = useState('home');

  // ----- Handlers passed to views -----

  const goHome = () => setCurrentView('home');

  // Remember where we came from (Home, Attendance or Marks), then open the course
  const openCourse = (courseId) => {
    setPreviousView(currentView);
    setSelectedCourseId(courseId);
    setCurrentView('courseDetail');
  };

  // Back from CourseDetailView returns to the view that opened it
  const goBackFromCourse = () => setCurrentView(previousView);

  // Adds a course to the list (the new course gets a unique id from the timestamp)
  const addCourse = (newCourse) => {
    setCourses([...courses, { ...newCourse, id: Date.now().toString() }]);
    setCurrentView('home');
  };

  // Conditional rendering: pick the view to show based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView courses={courses} onNavigate={setCurrentView} onOpenCourse={openCourse} />;
      default:
        // Temporary placeholder until the other views are built in the next step
        return (
          <>
            <ScreenHeader
              title="Coming soon"
              onBack={currentView === 'courseDetail' ? goBackFromCourse : goHome}
            />
            <EmptyState title="This view is not built yet" />
          </>
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
