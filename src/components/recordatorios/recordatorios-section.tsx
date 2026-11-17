import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { configureNotifications, scheduleReminder, getScheduledReminderCount, cancelAllReminders } from '../../services/notification.service';
import { COLORS } from '../../constants/colors';

export default function RecordatoriosSection() {
  const [seconds, setSeconds] = useState('10');
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const refreshCount = async () => {
    try { setPendingCount(await getScheduledReminderCount()); }
    catch { Alert.alert('Error', 'No se pudieron consultar los recordatorios.'); }
  };
  useEffect(() => {
    let active = true;
    getScheduledReminderCount().then((count) => { if (active) setPendingCount(count); }).catch(() => {
      if (active) Alert.alert('Error', 'No se pudieron consultar los recordatorios.');
    });
    return () => { active = false; };
  }, []);
  const programarRecordatorio = async () => {
    const delay = Number(seconds);
    if (!Number.isInteger(delay) || delay < 5 || delay > 86400) {
      Alert.alert('Tiempo no válido', 'Elige entre 5 y 86400 segundos (24 horas).'); return;
    }
    try {
      setLoading(true); await configureNotifications(); await scheduleReminder(delay); await refreshCount();
      Alert.alert('Recordatorio programado', 'Recibirás una notificación en ' + delay + ' segundos.');
    } catch (error) {
      Alert.alert('No se pudo programar', error instanceof Error ? error.message : 'Inténtalo de nuevo.');
    } finally { setLoading(false); }
  };
  const cancelarRecordatorios = async () => {
    try {
      setLoading(true); await cancelAllReminders(); await refreshCount();
      Alert.alert('Recordatorios cancelados', 'Se eliminaron todas las notificaciones pendientes.');
    } catch { Alert.alert('Error', 'No se pudieron cancelar los recordatorios.'); }
    finally { setLoading(false); }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordatorios</Text>
      <Text style={styles.subtitle}>Programa notificaciones locales y administra las que siguen pendientes.</Text>
      <View style={styles.iconContainer}><Text style={styles.icon}>🔔</Text></View>
      <Text style={styles.label}>Avisarme dentro de (segundos)</Text>
      <TextInput accessibilityLabel="Segundos hasta el recordatorio" style={styles.input} value={seconds}
        onChangeText={(value) => setSeconds(value.replace(/[^0-9]/g, '').slice(0, 5))}
        keyboardType="number-pad" maxLength={5} placeholder="Ej. 30" />
      <Text style={styles.hint}>Mínimo 5 segundos · máximo 24 horas</Text>
      <View style={styles.counter}><Text style={styles.counterNumber}>{pendingCount}</Text>
        <Text style={styles.counterLabel}>{pendingCount === 1 ? 'recordatorio pendiente' : 'recordatorios pendientes'}</Text></View>
      <Pressable style={[styles.button, loading && styles.disabled]} onPress={programarRecordatorio} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Programar recordatorio</Text>}
      </Pressable>
      <Pressable style={[styles.cancelButton, (loading || pendingCount === 0) && styles.disabled]} onPress={cancelarRecordatorios} disabled={loading || pendingCount === 0}>
        <Text style={styles.cancelText}>Cancelar todos los pendientes</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, padding: 22, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  iconContainer: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#E8F5FD', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  icon: { fontSize: 42 }, label: { width: '100%', color: COLORS.text, fontWeight: '600', marginBottom: 8 },
  input: { width: '100%', borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FAFCFE', borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 18, textAlign: 'center' },
  hint: { width: '100%', color: COLORS.textSecondary, fontSize: 12, marginTop: 7 },
  counter: { width: '100%', backgroundColor: '#F4F9FC', borderRadius: 12, padding: 14, alignItems: 'center', marginVertical: 18 },
  counterNumber: { color: COLORS.primary, fontSize: 25, fontWeight: 'bold' }, counterLabel: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  button: { backgroundColor: COLORS.primary, padding: 16, width: '100%', borderRadius: 12, alignItems: 'center' }, buttonText: { color: COLORS.white, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#FDEEEF', padding: 15, width: '100%', borderRadius: 12, alignItems: 'center', marginTop: 10 }, cancelText: { color: COLORS.danger, fontWeight: 'bold' }, disabled: { opacity: 0.5 },
});
