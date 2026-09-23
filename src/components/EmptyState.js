import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { COLORS } from '../constants/config';

// Friendly message shown when a list has nothing to display.
// Pass `actionTitle` + `onAction` to also show a button.
export default function EmptyState({ title, message, actionTitle, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionTitle ? (
        <View style={styles.button}>
          <PrimaryButton title={actionTitle} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
});
