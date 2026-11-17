import { ScrollView, StyleSheet } from 'react-native';
import DatosSection from '../components/datos/datos-section';
import { COLORS } from '../constants/colors';

export default function DatosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DatosSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
});
