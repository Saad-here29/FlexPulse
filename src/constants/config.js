// App-wide constants. Change values here instead of hardcoding them in screens.

// Minimum attendance (%) required by FAST to sit the final exam
export const ATTENDANCE_THRESHOLD = 80;

// A course within this many % above the threshold is shown as "warning"
export const WARNING_MARGIN = 5;

// One theme used by every component
export const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  background: '#F4F6FB',
  card: '#FFFFFF',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',

  safe: '#16A34A',
  safeLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
};

// Colour for each attendance status (used by badges, bars and charts)
export const STATUS_COLORS = {
  safe: COLORS.safe,
  warning: COLORS.warning,
  danger: COLORS.danger,
};

// Text shown for each attendance status
export const STATUS_LABELS = {
  safe: 'Safe',
  warning: 'Warning',
  danger: 'At Risk',
};

// Shared look for every react-native-chart-kit chart
export const CHART_CONFIG = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`, // COLORS.primary
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // COLORS.textMuted
  barPercentage: 0.7,
  propsForBackgroundLines: { stroke: COLORS.border, strokeDasharray: '' },
  propsForLabels: { fontSize: 10 },
};

// Add Course form limits
export const MAX_CODE_LENGTH = 8;
export const MIN_CREDIT_HOURS = 1;
export const MAX_CREDIT_HOURS = 4;

// Assessments given to a newly added course (no marks yet, so obtained is null)
export const DEFAULT_ASSESSMENTS = [
  { name: 'Quizzes', weight: 10, obtained: null, outOf: 100 },
  { name: 'Assignments', weight: 10, obtained: null, outOf: 100 },
  { name: 'Midterm 1', weight: 15, obtained: null, outOf: 100 },
  { name: 'Midterm 2', weight: 15, obtained: null, outOf: 100 },
  { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
];

// FAST absolute grading scheme, highest first: { min percentage, grade, points }.
// The exact (unrounded) score is compared with min, so 89.6 is A and 90.0 is A+.
// getGrade() and getGradePoints() both read from this one array.
export const GRADE_SCALE = [
  { min: 90, grade: 'A+', points: 4.00 },
  { min: 86, grade: 'A', points: 4.00 },
  { min: 82, grade: 'A-', points: 3.67 },
  { min: 78, grade: 'B+', points: 3.33 },
  { min: 74, grade: 'B', points: 3.00 },
  { min: 70, grade: 'B-', points: 2.67 },
  { min: 66, grade: 'C+', points: 2.33 },
  { min: 62, grade: 'C', points: 2.00 },
  { min: 58, grade: 'C-', points: 1.67 },
  { min: 54, grade: 'D+', points: 1.33 },
  { min: 50, grade: 'D', points: 1.00 },
  { min: 0, grade: 'F', points: 0.00 },
];

// Grade selected first in the Course Detail target-grade chips
export const DEFAULT_TARGET_GRADE = 'B';

// Shown wherever grades are estimated
export const GRADING_NOTE = 'Estimated using FAST absolute grading; actual grades may be relative.';
