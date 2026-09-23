# FLEX Pulse

A smarter companion to the FAST FLEX student portal, built with React Native (Expo) and plain JavaScript.

## Problem Statement

FLEX shows students their raw attendance and marks, but it does not answer the questions students actually have:

- **How many more classes can I miss** before I drop below the attendance requirement?
- **Which courses are at risk** right now?
- **What do I need in the final exam** to get the grade I want?

Students work this out by hand, often wrongly, and find out too late that they are short on attendance or cannot reach a grade.

## Proposed Solution

FLEX Pulse takes each course's attendance and assessment marks and turns them into clear answers:

- It flags every course as **Safe**, **Warning** (close to the limit) or **At Risk** (below the limit).
- It tells you exactly how many classes you can **skip**, or how many you must **attend in a row to recover**.
- It calculates the **percentage you need in the remaining assessments** for any target grade, and says whether that is already secured, achievable, or impossible.

The attendance limit (80%) and warning margin (5%) live in one config file, so changing them updates the whole app.

## Features

- **Dashboard**
  - Greeting and three stat cards: overall attendance, number of at-risk courses and estimated GPA.
  - An alert banner listing at-risk courses, with recovery advice for each.
  - Three live charts: attendance per course (bar), course status split (pie) and current scores (progress rings).
- **Attendance Planner**
  - Search, status filter chips and a lowest/highest sort.
  - **Present / Absent** buttons that update the percentage, status and charts instantly.
- **Marks & Final Calculator**
  - Courses sorted by score, lowest first, with grade and credit hours.
- **Course Detail**
  - Attendance summary and advice, plus assessment marks, with "Pending" for anything not yet graded.
  - Target grade chips that show the score you need in the remaining assessments.
- **Add Course**
  - A validated form with inline error messages.
  - Rejects: empty fields, credit hours outside 1–4, decimals and negative numbers, attended more than total, and duplicate course codes.
- **Empty states** on every screen, including the case where there are no courses at all.
- **Navigation without a library**
  - The Home screen has action cards, and sub-screens have a Back button.
  - Back from Course Detail returns to whichever screen opened it.

## Folder Structure

```
flex-pulse/
├── App.js                         Holds all app state (courses, current view) and switches views
├── index.js                       Expo entry point that registers App
├── app.json                       Expo app configuration (name, icons, orientation)
├── package.json                   Dependencies and npm scripts
├── assets/                        App icon, splash and favicon images
└── src/
    ├── constants/
    │   └── config.js              Attendance threshold, warning margin, colours, grade scale, chart style, form limits
    ├── data/
    │   └── courses.js             The 5 sample courses the app starts with
    ├── utils/
    │   ├── calculations.js        Pure functions: attendance %, status, skip/recover, scores, grades, required final score
    │   └── validation.js          Pure function that validates the Add Course form
    ├── components/
    │   ├── Card.js                White rounded card with a soft shadow; tappable if given onPress
    │   ├── ChartCard.js           Card with a title and one-line explanation for a chart
    │   ├── CourseCard.js          Course summary: attendance bar, status badge, advice, optional Present/Absent buttons
    │   ├── EmptyState.js          Message shown when a list is empty, with an optional button
    │   ├── FilterChips.js         Row of selectable chips (status filter, target grade)
    │   ├── FormField.js           Label + text input + red error message
    │   ├── PrimaryButton.js       Main action button with a disabled state
    │   ├── ProgressBar.js         Horizontal bar filled to a percentage
    │   ├── ScreenHeader.js        Screen title, subtitle and optional Back button
    │   ├── SearchBar.js           Search input with a clear (✕) button
    │   └── StatusBadge.js         Coloured Safe / Warning / At Risk pill
    └── views/
        ├── HomeView.js            Dashboard: stats, alert banner, action cards and charts
        ├── AttendanceView.js      Attendance Planner: search, filter, sort, mark Present/Absent
        ├── MarksView.js           Courses sorted by score with grade and credit hours
        ├── CourseDetailView.js    One course: attendance, assessments and target grade calculator
        └── AddCourseView.js       Form to add a new course
```

## Where Each React Concept Is Used

| Concept | Where |
|---|---|
| **State (`useState`)** | `App.js`: `courses`, `currentView`, `selectedCourseId`, `previousView`, `notice`. `AttendanceView.js`: search text, status filter, sort order, last marked course. `CourseDetailView.js`: selected target grade. `AddCourseView.js`: form values, touched fields. |
| **Refs (`useRef`)** | `AddCourseView.js`: keyboard "Next" moves focus to the following input. |
| **Props** | `App.js` passes `courses` and handler functions (`onBack`, `onOpenCourse`, `onMarkAttendance`, `onAddCourse`) to every view. Views pass data down to components such as `CourseCard`, `StatusBadge`, `ProgressBar` and `FormField`. |
| **Events** | `onPress` on cards, chips and buttons (all components and views). `onChangeText` / `onBlur` / `onSubmitEditing` in `AddCourseView.js` and `SearchBar.js`. |
| **Conditional rendering** | `App.js` `renderView()` switch on `currentView`. Empty states in every view. Alert banner in `HomeView.js`. Back button in `ScreenHeader.js`. Present/Absent buttons in `CourseCard.js`. Error messages in `FormField.js`. Target grade messages in `CourseDetailView.js`. |
| **Lists (`.map`, `.filter`, `.reduce`, `.sort`)** | `.map`: rendering every list, building chart data and immutably updating a course in `App.js`. `.filter`: search and status filter in `AttendanceView.js`, at-risk courses in `HomeView.js`. `.reduce`: overall attendance and GPA in `HomeView.js`, graded weight in `calculations.js`. `.sort` on a copy: `AttendanceView.js` and `MarksView.js`. |
| **Forms** | `AddCourseView.js` with `FormField.js`: controlled inputs, validation in `utils/validation.js`, inline errors and a submit button disabled until the form is valid. `KeyboardAvoidingView` + `ScrollView` stop the keyboard covering inputs. |

## Libraries

| Library | Why |
|---|---|
| `react-native-chart-kit` | Draws the bar, pie and progress charts on the dashboard. |
| `react-native-svg` | Required by react-native-chart-kit, which draws its charts as SVG. |
| `react-native-safe-area-context` | Keeps content clear of the notch and status bar. It is the official replacement for React Native's deprecated `SafeAreaView`. |

No navigation library is used: screens are switched with the `currentView` state in `App.js`.

## Setup and Run

1. Install [Node.js](https://nodejs.org/) (LTS) and the **Expo Go** app on your phone (Play Store / App Store).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code:
   - **Android:** scan it with the Expo Go app.
   - **iPhone:** scan it with the Camera app.

   Your phone and computer must be on the same Wi-Fi network.

To change the attendance limit, edit `ATTENDANCE_THRESHOLD` in `src/constants/config.js`. Every screen, message and chart updates automatically.

## Screenshots

| Dashboard | Attendance Planner | Marks |
|---|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Attendance Planner](screenshots/attendance.png) | ![Marks](screenshots/marks.png) |

| Course Detail | Add Course | Empty State |
|---|---|---|
| ![Course Detail](screenshots/course-detail.png) | ![Add Course](screenshots/add-course.png) | ![Empty State](screenshots/empty-state.png) |
