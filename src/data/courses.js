// Starting data for the app. `obtained: null` means the assessment has not happened yet.
// Attendance mix (with the default threshold in config.js): 3 safe, 1 warning, 1 danger.

const initialCourses = [
  {
    id: '1',
    code: 'CS4051',
    name: 'Mobile Application Development',
    instructor: 'Dr. Ayesha Khan',
    creditHours: 3,
    attended: 26,
    total: 28, // 92.9% - safe
    assessments: [
      { name: 'Quizzes', weight: 10, obtained: 17, outOf: 20 },
      { name: 'Assignments', weight: 10, obtained: 38, outOf: 40 },
      { name: 'Midterm 1', weight: 15, obtained: 24, outOf: 30 },
      { name: 'Midterm 2', weight: 15, obtained: 26, outOf: 30 },
      { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
    ],
  },
  {
    id: '2',
    code: 'CS3009',
    name: 'Software Engineering',
    instructor: 'Mr. Bilal Ahmed',
    creditHours: 3,
    attended: 25,
    total: 28, // 89.3% - safe
    assessments: [
      { name: 'Quizzes', weight: 10, obtained: 12, outOf: 20 },
      { name: 'Assignments', weight: 10, obtained: 30, outOf: 40 },
      { name: 'Midterm 1', weight: 15, obtained: 18, outOf: 30 },
      { name: 'Midterm 2', weight: 15, obtained: 20, outOf: 30 },
      { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
    ],
  },
  {
    id: '3',
    code: 'CS2005',
    name: 'Database Systems',
    instructor: 'Dr. Usman Tariq',
    creditHours: 3,
    attended: 21,
    total: 25, // 84.0% - warning (just above the threshold)
    assessments: [
      { name: 'Quizzes', weight: 10, obtained: 14, outOf: 20 },
      { name: 'Assignments', weight: 10, obtained: 34, outOf: 40 },
      { name: 'Midterm 1', weight: 15, obtained: 15, outOf: 30 },
      { name: 'Midterm 2', weight: 15, obtained: 19, outOf: 30 },
      { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
    ],
  },
  {
    id: '4',
    code: 'MT2005',
    name: 'Probability & Statistics',
    instructor: 'Ms. Sana Iqbal',
    creditHours: 3,
    attended: 17,
    total: 23, // 73.9% - danger (below the threshold)
    assessments: [
      { name: 'Quizzes', weight: 10, obtained: 9, outOf: 20 },
      { name: 'Assignments', weight: 10, obtained: 22, outOf: 40 },
      { name: 'Midterm 1', weight: 15, obtained: 13, outOf: 30 },
      { name: 'Midterm 2', weight: 15, obtained: 14, outOf: 30 },
      { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
    ],
  },
  {
    id: '5',
    code: 'SS2012',
    name: 'Technical & Business Writing',
    instructor: 'Ms. Hira Malik',
    creditHours: 2,
    attended: 14,
    total: 15, // 93.3% - safe
    assessments: [
      { name: 'Assignments', weight: 20, obtained: 34, outOf: 40 },
      { name: 'Presentation', weight: 10, obtained: 8, outOf: 10 },
      { name: 'Midterm', weight: 20, obtained: 16, outOf: 25 },
      { name: 'Final Exam', weight: 50, obtained: null, outOf: 100 },
    ],
  },
];

export default initialCourses;
