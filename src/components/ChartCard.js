import { Text, StyleSheet } from 'react-native';
import Card from './Card';
import { COLORS } from '../constants/config';

// Card with a title and a one-line explanation above a chart
export default function ChartCard({ title, description, children }) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
});
