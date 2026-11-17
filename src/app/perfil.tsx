import { ScrollView, StyleSheet } from 'react-native';
import PerfilSection from '../components/perfil/perfil-section';
import { COLORS } from '../constants/colors';

export default function PerfilScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PerfilSection />
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
