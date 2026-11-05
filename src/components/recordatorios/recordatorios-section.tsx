import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cancelAllReminders, cancelReminder, getScheduledReminders, scheduleReminder, type ScheduledReminder } from '../../services/notification.service';
import { COLORS } from '../../constants/colors';

type Notice = { kind: 'success' | 'error'; text: string } | null;
const PRESETS = [{ label: '10 s', value: 10 }, { label: '30 s', value: 30 }, { label: '1 min', value: 60 }, { label: '5 min', value: 300 }];

export default function RecordatoriosSection() {
  const [seconds, setSeconds] = useState('10');
  const [title, setTitle] = useState('Recordatorio');
  const [message, setMessage] = useState('Es momento de revisar tu app.');
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try { setReminders(await getScheduledReminders()); }
    catch { setNotice({ kind: 'error', text: 'No se pudieron consultar los avisos. Inténtalo de nuevo.' }); }
    finally { setRefreshing(false); }
  }, []);

  useEffect(() => {
    let mounted = true;
    getScheduledReminders().then((items) => { if (mounted) setReminders(items); })
      .catch(() => { if (mounted) setNotice({ kind: 'error', text: 'No se pudieron consultar los avisos. Inténtalo de nuevo.' }); })
      .finally(() => { if (mounted) setRefreshing(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleReminderChange = () => { void refresh(); };
    window.addEventListener('mi-app:web-reminders-updated', handleReminderChange);
    return () => window.removeEventListener('mi-app:web-reminders-updated', handleReminderChange);
  }, [refresh]);

  const createReminder = async () => {
    const delay = Number(seconds);
    if (!Number.isInteger(delay) || delay < 5 || delay > 86400) {
      setNotice({ kind: 'error', text: 'Elige un intervalo entre 5 segundos y 24 horas.' });
      return;
    }
    if (!title.trim() || !message.trim()) {
      setNotice({ kind: 'error', text: 'Escribe un título y un mensaje.' });
      return;
    }
    try {
      setBusy(true);
      setNotice(null);
      await scheduleReminder(delay, title, message);
      await refresh();
      setNotice({ kind: 'success', text: '“' + title.trim() + '” quedó programado para dentro de ' + duration(delay) + '.' });
    } catch (error) {
      setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'No se pudo programar. Inténtalo de nuevo.' });
    } finally { setBusy(false); }
  };

  const removeOne = async (id: string) => {
    try {
      setBusy(true);
      await cancelReminder(id);
      await refresh();
      setNotice({ kind: 'success', text: 'Recordatorio cancelado.' });
    } catch { setNotice({ kind: 'error', text: 'No se pudo cancelar el aviso. Inténtalo de nuevo.' }); }
    finally { setBusy(false); }
  };

  const removeAll = async () => {
    try {
      setBusy(true);
      await cancelAllReminders();
      await refresh();
      setConfirmRemoveAll(false);
      setNotice({ kind: 'success', text: 'Se cancelaron todos los avisos pendientes.' });
    } catch { setNotice({ kind: 'error', text: 'No se pudieron cancelar los avisos. Inténtalo de nuevo.' }); }
    finally { setBusy(false); }
  };

  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>{String.fromCodePoint(0x1F514)}</Text>
        <Text style={styles.title}>Mis recordatorios</Text>
        <Text style={styles.subtitle}>Edita el aviso y elige cuándo quieres recibirlo.</Text>
      </View>

      <Text style={styles.label}>Título</Text>
      <TextInput accessibilityLabel="Título del recordatorio" style={styles.input} value={title} onChangeText={(value) => { setTitle(value); setNotice(null); }} placeholder="Ej. Revisar mis tareas" maxLength={60} returnKeyType="next" editable={!busy} />

      <Text style={styles.label}>Mensaje</Text>
      <TextInput accessibilityLabel="Mensaje del recordatorio" style={[styles.input, styles.messageInput]} value={message} onChangeText={(value) => { setMessage(value); setNotice(null); }} placeholder="¿Qué quieres recordar?" maxLength={140} multiline textAlignVertical="top" editable={!busy} />

      <Text style={styles.label}>¿Cuándo te aviso?</Text>
      <View style={styles.presets}>
        {PRESETS.map((item) => {
          const selected = Number(seconds) === item.value;
          return <Pressable key={item.value} accessibilityRole="button" accessibilityState={{ selected }} style={({ pressed }) => [styles.preset, selected && styles.presetSelected, pressed && styles.pressed]} onPress={() => { setSeconds(String(item.value)); setNotice(null); }} disabled={busy}>
            <Text style={[styles.presetText, selected && styles.presetTextSelected]}>{item.label}</Text>
          </Pressable>;
        })}
      </View>
      <View style={styles.customRow}>
        <Text style={styles.customLabel}>Tiempo personalizado</Text>
        <View style={styles.secondsWrap}>
          <TextInput accessibilityLabel="Intervalo en segundos" style={styles.secondsInput} value={seconds} onChangeText={(value) => { setSeconds(value.replace(/[^0-9]/g, '').slice(0, 5)); setNotice(null); }} keyboardType="number-pad" maxLength={5} placeholder="10" editable={!busy} />
          <Text style={styles.unit}>seg</Text>
        </View>
      </View>
      <Text style={styles.hint}>Desde 5 segundos hasta 24 horas.</Text>

      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primary, (busy || !title.trim() || !message.trim()) && styles.disabled, pressed && styles.pressed]} onPress={createReminder} disabled={busy || !title.trim() || !message.trim()}>
        {busy ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryText}>Programar recordatorio</Text>}
      </Pressable>

      {notice && <View accessibilityLiveRegion="polite" style={[styles.notice, notice.kind === 'success' ? styles.successNotice : styles.errorNotice]}>
        <Text style={[styles.noticeText, notice.kind === 'success' ? styles.successText : styles.errorText]}>{notice.text}</Text>
      </View>}

      <View style={styles.listHeader}>
        <View><Text style={styles.listTitle}>Pendientes</Text><Text style={styles.listSubtitle}>{reminders.length} {reminders.length === 1 ? 'aviso' : 'avisos'}</Text></View>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.refresh, pressed && styles.pressed]} onPress={refresh} disabled={refreshing || busy}>
          <Text style={styles.refreshText}>{refreshing ? 'Actualizando…' : 'Actualizar'}</Text>
        </Pressable>
      </View>

      {refreshing ? <ActivityIndicator color={COLORS.primary} style={styles.spinner} /> : reminders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{String.fromCodePoint(0x1F5D3)}</Text>
          <Text style={styles.emptyTitle}>Aún no tienes avisos</Text>
          <Text style={styles.emptyText}>Cuando programes uno, aparecerá aquí.</Text>
        </View>
      ) : <View style={styles.list}>
        {reminders.map((item) => <View key={item.identifier} style={styles.reminder}>
          <View style={styles.reminderCopy}>
            <Text style={styles.reminderTitle} numberOfLines={1}>{item.content.title || 'Recordatorio'}</Text>
            <Text style={styles.reminderMessage} numberOfLines={2}>{item.content.body || 'Sin mensaje'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={'Cancelar ' + (item.content.title || 'recordatorio')} style={({ pressed }) => [styles.remove, pressed && styles.pressed]} onPress={() => removeOne(item.identifier)} disabled={busy}>
            <Text style={styles.removeText}>Cancelar</Text>
          </Pressable>
        </View>)}
      </View>}

      {confirmRemoveAll ? <View style={styles.confirmBox}>
        <Text style={styles.confirmTitle}>¿Cancelar todos los avisos?</Text>
        <Text style={styles.confirmDescription}>Se quitarán todas las notificaciones pendientes.</Text>
        <View style={styles.confirmActions}>
          <Pressable style={({ pressed }) => [styles.keepButton, pressed && styles.pressed]} onPress={() => setConfirmRemoveAll(false)} disabled={busy}><Text style={styles.keepText}>Volver</Text></Pressable>
          <Pressable style={({ pressed }) => [styles.confirmDelete, pressed && styles.pressed]} onPress={removeAll} disabled={busy}><Text style={styles.removeText}>{busy ? 'Cancelando…' : 'Sí, cancelar'}</Text></Pressable>
        </View>
      </View> : reminders.length > 0 && <Pressable accessibilityRole="button" style={({ pressed }) => [styles.removeAll, busy && styles.disabled, pressed && styles.pressed]} onPress={() => setConfirmRemoveAll(true)} disabled={busy}>
        <Text style={styles.removeAllText}>Cancelar todos</Text>
      </Pressable>}
    </View>
  );
}

function duration(value: number) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;
  const parts: string[] = [];
  if (hours) parts.push(hours + (hours === 1 ? ' hora' : ' horas'));
  if (minutes) parts.push(minutes + (minutes === 1 ? ' minuto' : ' minutos'));
  if (seconds || parts.length === 0) parts.push(seconds + (seconds === 1 ? ' segundo' : ' segundos'));
  return parts.join(' y ');
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, padding: 22, borderRadius: 22, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  hero: { alignItems: 'center', marginBottom: 18 },
  heroIcon: { width: 66, height: 66, lineHeight: 66, textAlign: 'center', borderRadius: 20, backgroundColor: '#E8F5FD', fontSize: 32, overflow: 'hidden', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 7, lineHeight: 21 },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginTop: 15, marginBottom: 8 },
  input: { minHeight: 50, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FAFCFE', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: COLORS.text, fontSize: 15 },
  messageInput: { minHeight: 82, paddingTop: 13 },
  presets: { flexDirection: 'row', gap: 8, marginTop: 3 },
  preset: { flex: 1, backgroundColor: '#F4F9FC', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  presetSelected: { backgroundColor: '#E8F5FD', borderColor: COLORS.primary },
  presetText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 12 },
  presetTextSelected: { color: COLORS.primary, fontWeight: '800' },
  customRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  customLabel: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  secondsWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: '#FAFCFE', paddingHorizontal: 10 },
  secondsInput: { minWidth: 52, paddingVertical: 8, textAlign: 'center', color: COLORS.text, fontWeight: '700', fontSize: 15 },
  unit: { color: COLORS.textSecondary, fontSize: 12 },
  hint: { color: COLORS.textSecondary, fontSize: 12, marginTop: 6 },
  primary: { minHeight: 52, backgroundColor: COLORS.primary, paddingHorizontal: 16, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  primaryText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
  notice: { borderRadius: 11, padding: 12, marginTop: 12 },
  successNotice: { backgroundColor: '#E5F7ED' },
  errorNotice: { backgroundColor: '#FDEEEF' },
  noticeText: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.danger },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 },
  listTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  listSubtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  refresh: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#E8F5FD' },
  refreshText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  spinner: { marginVertical: 20 },
  empty: { backgroundColor: '#F7FAFC', borderRadius: 14, alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 26, marginBottom: 7 },
  emptyTitle: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 5 },
  list: { gap: 9 },
  reminder: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FAFCFE', borderRadius: 13, padding: 12, gap: 10 },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  reminderMessage: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  remove: { minHeight: 38, justifyContent: 'center', paddingHorizontal: 11, borderRadius: 9, backgroundColor: '#FDEEEF' },
  removeText: { color: COLORS.danger, fontWeight: '700', fontSize: 12 },
  removeAll: { minHeight: 46, backgroundColor: '#FDEEEF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  removeAllText: { color: COLORS.danger, fontWeight: '800', fontSize: 14 },
  confirmBox: { backgroundColor: '#FFF8F8', borderColor: '#F5C9CC', borderWidth: 1, borderRadius: 12, padding: 14, marginTop: 12 },
  confirmTitle: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  confirmDescription: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
  confirmActions: { flexDirection: 'row', gap: 10, marginTop: 13 },
  keepButton: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5FD', borderRadius: 10 },
  keepText: { color: COLORS.primaryDark, fontWeight: '700' },
  confirmDelete: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDEEEF', borderRadius: 10 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});
