import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

// White rounded box with a soft shadow. Becomes tappable when `onPress` is given.
export default function Card({ children, onPress, style }) {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Android shadow
    elevation: 2,
  },
});
