import { ScrollView, StyleSheet } from 'react-native';
import RecordatoriosSection from '../components/recordatorios/recordatorios-section';

export default function RecordatoriosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RecordatoriosSection />
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
