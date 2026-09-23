import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Text, Platform, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, MAX_CODE_LENGTH, DEFAULT_ASSESSMENTS } from '../constants/config';
import { validateCourse } from '../utils/validation';

const EMPTY_FORM = { code: '', name: '', instructor: '', creditHours: '', attended: '', total: '' };

export default function AddCourseView({ courses, onAddCourse, onBack }) {
  const [form, setForm] = useState(EMPTY_FORM);
  // Fields the user has typed in or left, so errors don't show on an untouched form
  const [touched, setTouched] = useState({});

  const errors = validateCourse(form, courses);
  const isValid = Object.keys(errors).length === 0;

  // Update one field without changing the others, and mark it as touched
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    setTouched({ ...touched, [field]: true });
  };
  const markTouched = (field) => setTouched({ ...touched, [field]: true });

  // Only show a field's error after the user has touched it
  const errorFor = (field) => (touched[field] ? errors[field] : null);

  // Each input stores itself here so "Next" on the keyboard can focus the following field
  const inputs = {};
  const focusNext = (field) => inputs[field] && inputs[field].focus();

  const handleSubmit = () => {
    if (!isValid) return;
    onAddCourse({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      instructor: form.instructor.trim(),
      creditHours: Number(form.creditHours),
      attended: Number(form.attended),
      total: Number(form.total),
      // Copy each default assessment so courses never share the same objects
      assessments: DEFAULT_ASSESSMENTS.map((a) => ({ ...a })),
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Add Course" subtitle="Track a new course this semester" onBack={onBack} />

        <View style={styles.body}>
          <FormField
            label="Course code"
            placeholder="e.g. CS3001"
            value={form.code}
            onChangeText={(text) => updateField('code', text)}
            onBlur={() => markTouched('code')}
            error={errorFor('code')}
            autoCapitalize="characters"
            maxLength={MAX_CODE_LENGTH}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusNext('name')}
          />
          <FormField
            label="Course name"
            placeholder="e.g. Computer Networks"
            value={form.name}
            onChangeText={(text) => updateField('name', text)}
            onBlur={() => markTouched('name')}
            error={errorFor('name')}
            inputRef={(el) => (inputs.name = el)}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusNext('instructor')}
          />
          <FormField
            label="Instructor"
            placeholder="e.g. Dr. Ali Hassan"
            value={form.instructor}
            onChangeText={(text) => updateField('instructor', text)}
            onBlur={() => markTouched('instructor')}
            error={errorFor('instructor')}
            inputRef={(el) => (inputs.instructor = el)}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusNext('creditHours')}
          />
          <FormField
            label="Credit hours"
            placeholder="1 to 4"
            value={form.creditHours}
            onChangeText={(text) => updateField('creditHours', text)}
            onBlur={() => markTouched('creditHours')}
            error={errorFor('creditHours')}
            inputRef={(el) => (inputs.creditHours = el)}
            keyboardType="numeric"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusNext('attended')}
          />
          <FormField
            label="Classes attended"
            placeholder="e.g. 20"
            value={form.attended}
            onChangeText={(text) => updateField('attended', text)}
            onBlur={() => markTouched('attended')}
            error={errorFor('attended')}
            inputRef={(el) => (inputs.attended = el)}
            keyboardType="numeric"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusNext('total')}
          />
          <FormField
            label="Total classes held"
            placeholder="e.g. 24"
            value={form.total}
            onChangeText={(text) => updateField('total', text)}
            onBlur={() => markTouched('total')}
            error={errorFor('total')}
            inputRef={(el) => (inputs.total = el)}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <PrimaryButton title="Add Course" onPress={handleSubmit} disabled={!isValid} />
          {!isValid ? <Text style={styles.hint}>Fill in every field correctly to continue.</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});
