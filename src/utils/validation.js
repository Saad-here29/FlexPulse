// Validation for the Add Course form. Pure function: form values in, error messages out.
import { MIN_CREDIT_HOURS, MAX_CREDIT_HOURS } from '../constants/config';

// True for "0", "12" etc. Rejects "", "-1", "2.5" and "abc".
function isWholeNumber(text) {
  return /^\d+$/.test(text.trim());
}

// Returns an object like { code: 'Course code is required' }.
// An empty object means the form is valid.
export function validateCourse(form, existingCourses) {
  const errors = {};

  // Course code: required and must not already exist (ignoring upper/lower case)
  const code = form.code.trim().toLowerCase();
  if (code === '') {
    errors.code = 'Course code is required';
  } else if (existingCourses.some((c) => c.code.toLowerCase() === code)) {
    errors.code = 'You already have a course with this code';
  }

  if (form.name.trim() === '') errors.name = 'Course name is required';
  if (form.instructor.trim() === '') errors.instructor = 'Instructor name is required';

  // Credit hours: whole number in the allowed range
  if (form.creditHours.trim() === '') {
    errors.creditHours = 'Credit hours are required';
  } else if (!isWholeNumber(form.creditHours)) {
    errors.creditHours = 'Enter a whole number';
  } else {
    const hours = Number(form.creditHours);
    if (hours < MIN_CREDIT_HOURS || hours > MAX_CREDIT_HOURS) {
      errors.creditHours = `Credit hours must be between ${MIN_CREDIT_HOURS} and ${MAX_CREDIT_HOURS}`;
    }
  }

  // Attended and total: whole numbers, 0 or more
  if (form.attended.trim() === '') errors.attended = 'Classes attended is required';
  else if (!isWholeNumber(form.attended)) errors.attended = 'Enter a whole number (0 or more)';

  if (form.total.trim() === '') errors.total = 'Total classes is required';
  else if (!isWholeNumber(form.total)) errors.total = 'Enter a whole number (0 or more)';

  // Only compare once both numbers are valid
  if (!errors.attended && !errors.total && Number(form.attended) > Number(form.total)) {
    errors.attended = 'Attended cannot be more than total classes';
  }

  return errors;
}

// Validates marks typed for one assessment. Returns an error message, or null if valid.
export function validateMarks(text, outOf) {
  const value = text.trim();
  if (value === '') return 'Enter the marks';

  // Plain decimal number with an optional minus: "17", "17.5", ".5", "-1" (rejects "abc", "1e1")
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(value)) return 'Enter a number';

  const marks = Number(value);
  if (marks < 0) return 'Marks cannot be negative';
  if (marks > outOf) return `Marks cannot be more than ${outOf}`;
  if (/\.\d{3,}$/.test(value)) return 'Use at most 2 decimal places';
  return null;
}
