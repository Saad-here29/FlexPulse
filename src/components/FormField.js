import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

// Label + text input + red error message.
// Any other props (value, onChangeText, keyboardType...) are passed straight to TextInput.
export default function FormField({ label, error, inputRef, ...inputProps }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={COLORS.textMuted}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    fontSize: 13,
    color: COLORS.danger,
    marginTop: 4,
  },
});
