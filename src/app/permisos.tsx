import { ScrollView, StyleSheet } from 'react-native';
import PermisosSection from '../components/permisos/permisos-section';

export default function PermisosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PermisosSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 25,
    backgroundColor: '#F4F9FC',
  },
});
