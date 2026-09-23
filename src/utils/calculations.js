// Pure functions: they only use their inputs and return a value (no state, no UI).
import { ATTENDANCE_THRESHOLD, WARNING_MARGIN, GRADE_SCALE } from '../constants/config';

// ---------- Attendance ----------

// Percentage of classes attended. No classes held yet counts as 100%.
export function getAttendancePercent(attended, total) {
  if (total === 0) return 100;
  return (attended / total) * 100;
}

// 'safe' | 'warning' | 'danger' based on the threshold and warning margin
export function getAttendanceStatus(percent) {
  if (percent < ATTENDANCE_THRESHOLD) return 'danger';
  if (percent < ATTENDANCE_THRESHOLD + WARNING_MARGIN) return 'warning';
  return 'safe';
}

// True if attended/total is at or above the threshold.
// Compared with whole numbers (attended * 100 vs threshold * total) to avoid decimal rounding errors.
function meetsThreshold(attended, total) {
  return attended * 100 >= ATTENDANCE_THRESHOLD * total;
}

// Safety cap so the loops below can never run forever (e.g. with a threshold of 0 or 100)
const MAX_ITERATIONS = 1000;

// Max classes k the student can still miss so that attended / (total + k) stays >= threshold
export function getClassesCanSkip(attended, total) {
  let k = 0;
  // Keep adding one more missed class while the percentage would still be OK
  while (k < MAX_ITERATIONS && meetsThreshold(attended, total + k + 1)) {
    k++;
  }
  return k;
}

// Min classes n the student must attend in a row so that (attended + n) / (total + n) >= threshold.
// Returns null if recovery is impossible (UI shows "Cannot recover at this threshold").
export function getClassesToRecover(attended, total) {
  // At 100%, one missed class can never be made up
  if (ATTENDANCE_THRESHOLD >= 100 && attended < total) return null;

  let n = 0;
  // Each attended class adds 1 to both attended and total
  while (!meetsThreshold(attended + n, total + n)) {
    n++;
    if (n >= MAX_ITERATIONS) return null;
  }
  return n;
}

// One-line attendance advice for a course. Every screen uses this so the
// "No limit" and "Cannot recover" cases are always shown the same way.
export function getAttendanceAdvice(attended, total) {
  const status = getAttendanceStatus(getAttendancePercent(attended, total));

  if (status === 'danger') {
    const n = getClassesToRecover(attended, total);
    if (n === null) return 'Cannot recover at this threshold';
    return `Attend the next ${n} class${n === 1 ? '' : 'es'} to recover`;
  }

  const k = getClassesCanSkip(attended, total);
  if (k >= MAX_ITERATIONS) return 'Can skip: No limit';
  if (k === 0) return 'Cannot miss any more classes';
  return `Can skip ${k} more class${k === 1 ? '' : 'es'}`;
}

// ---------- Marks ----------

// Weighted marks earned so far (out of 100 for the whole course).
// Example: 24/30 in a 15% midterm adds (24 / 30) * 15 = 12 marks.
export function getCurrentScore(assessments) {
  let score = 0;
  assessments.forEach((a) => {
    if (a.obtained !== null) {
      score += (a.obtained / a.outOf) * a.weight;
    }
  });
  return score;
}

// Current score as a % of the work graded so far (e.g. 43 out of 50 graded = 86%).
// Returns null if nothing has been graded yet.
export function getScorePercent(assessments) {
  const gradedWeight = assessments
    .filter((a) => a.obtained !== null)
    .reduce((sum, a) => sum + a.weight, 0);

  if (gradedWeight === 0) return null;
  return (getCurrentScore(assessments) / gradedWeight) * 100;
}

// Letter grade for a percentage, using the first boundary the score reaches
export function getGrade(percent) {
  const match = GRADE_SCALE.find((g) => percent >= g.min);
  return match.grade;
}

// Grade points (0.0 - 4.0) for a percentage, used for the GPA estimate
export function getGradePoints(percent) {
  const match = GRADE_SCALE.find((g) => percent >= g.min);
  return match.points;
}

// Percentage needed in the remaining (ungraded) assessments, e.g. the final,
// to finish the course with `target` marks out of 100.
// Result > 100 means the target is impossible; <= 0 means it is already secured.
// Returns null when nothing is left to be graded (UI shows "All marks entered").
export function getRequiredFinalScore(assessments, target) {
  let remainingWeight = 0;
  assessments.forEach((a) => {
    if (a.obtained === null) remainingWeight += a.weight;
  });

  // Nothing left to grade: avoid dividing by zero
  if (remainingWeight === 0) return null;

  const marksStillNeeded = target - getCurrentScore(assessments);
  return (marksStillNeeded / remainingWeight) * 100;
}
