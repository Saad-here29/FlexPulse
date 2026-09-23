import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

// Main call-to-action button. Faded and not tappable when `disabled`.
// `outline` gives a white button with a coloured border for secondary actions (e.g. Cancel).
export default function PrimaryButton({ title, onPress, disabled = false, outline = false, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, outline && styles.outline, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  outline: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineText: {
    color: COLORS.primary,
  },
});
