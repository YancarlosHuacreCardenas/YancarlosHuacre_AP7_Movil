import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { deleteUserData, getUserData, saveUserData } from '../../services/storage.service';
import { COLORS } from '../../constants/colors';

type Notice = { kind: 'success' | 'error'; text: string } | null;

export default function DatosSection() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    let active = true;
    getUserData()
      .then((data) => {
        if (!active) return;
        if (data) {
          setNombre(data.nombre);
          setDescripcion(data.descripcion);
          setHasSavedData(true);
        }
      })
      .catch(() => {
        if (active) setNotice({ kind: 'error', text: 'No se pudieron recuperar los datos. Vuelve a intentarlo.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const guardarDatos = async () => {
    const nombreLimpio = nombre.trim();
    const descripcionLimpia = descripcion.trim();
    if (!nombreLimpio || !descripcionLimpia) {
      setNotice({ kind: 'error', text: 'Completa el nombre y la descripción antes de guardar.' });
      return;
    }
    try {
      setSaving(true);
      setNotice(null);
      await saveUserData({ nombre: nombreLimpio, descripcion: descripcionLimpia });
      setNombre(nombreLimpio);
      setDescripcion(descripcionLimpia);
      setHasSavedData(true);
      setConfirmDelete(false);
      setNotice({ kind: 'success', text: 'Información guardada correctamente en este dispositivo.' });
    } catch {
      setNotice({ kind: 'error', text: 'No se pudo guardar. Revisa el almacenamiento e inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const eliminarDatos = async () => {
    try {
      setSaving(true);
      setNotice(null);
      await deleteUserData();
      setNombre('');
      setDescripcion('');
      setHasSavedData(false);
      setConfirmDelete(false);
      setNotice({ kind: 'success', text: 'Información eliminada del dispositivo.' });
    } catch {
      setNotice({ kind: 'error', text: 'No se pudo eliminar la información. Inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const actualizarCampo = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setNotice(null);
    setConfirmDelete(false);
  };

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.loadingText}>Cargando información…</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Datos</Text>
      <Text style={styles.subtitle}>Edita tu información y guárdala en este dispositivo.</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        accessibilityLabel="Nombre completo"
        style={styles.input}
        placeholder="Escribe tu nombre"
        value={nombre}
        onChangeText={actualizarCampo(setNombre)}
        editable={!saving}
        maxLength={80}
        returnKeyType="next"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        accessibilityLabel="Descripción"
        style={[styles.input, styles.textArea]}
        placeholder="Escribe una descripción…"
        value={descripcion}
        onChangeText={actualizarCampo(setDescripcion)}
        editable={!saving}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />

      {notice && (
        <View accessibilityLiveRegion="polite" style={[styles.notice, notice.kind === 'success' ? styles.successNotice : styles.errorNotice]}>
          <Text style={[styles.noticeText, notice.kind === 'success' ? styles.successText : styles.errorText]}>{notice.text}</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.saveButton, (saving || !nombre.trim() || !descripcion.trim()) && styles.disabled, pressed && styles.pressed]}
        onPress={guardarDatos}
        disabled={saving || !nombre.trim() || !descripcion.trim()}
      >
        {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Guardar información</Text>}
      </Pressable>

      {confirmDelete ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>¿Eliminar la información guardada?</Text>
          <Text style={styles.confirmDescription}>Esta acción borrará el nombre y la descripción de este dispositivo.</Text>
          <View style={styles.confirmActions}>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.keepButton, pressed && styles.pressed]} onPress={() => setConfirmDelete(false)} disabled={saving}>
              <Text style={styles.keepText}>Conservar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.confirmDeleteButton, saving && styles.disabled, pressed && styles.pressed]} onPress={eliminarDatos} disabled={saving}>
              {saving ? <ActivityIndicator color={COLORS.danger} /> : <Text style={styles.deleteText}>Sí, eliminar</Text>}
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.deleteButton, (!hasSavedData || saving) && styles.disabled, pressed && styles.pressed]}
          onPress={() => { setNotice(null); setConfirmDelete(true); }}
          disabled={!hasSavedData || saving}
        >
          <Text style={styles.deleteText}>{hasSavedData ? 'Eliminar información' : 'No hay información guardada'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, padding: 22, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { marginTop: 8, marginBottom: 12, color: COLORS.textSecondary, lineHeight: 21 },
  label: { color: COLORS.text, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#FAFCFE', borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 15 },
  textArea: { minHeight: 120 },
  notice: { borderRadius: 10, padding: 12, marginTop: 16 },
  successNotice: { backgroundColor: '#E5F7ED' },
  errorNotice: { backgroundColor: '#FDEEEF' },
  noticeText: { fontSize: 13, lineHeight: 19, fontWeight: '600' },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.danger },
  saveButton: { minHeight: 50, backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonText: { color: COLORS.white, fontWeight: 'bold' },
  deleteButton: { minHeight: 48, backgroundColor: '#FDEEEF', padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  deleteText: { color: COLORS.danger, fontWeight: 'bold' },
  confirmBox: { backgroundColor: '#FFF8F8', borderColor: '#F5C9CC', borderWidth: 1, borderRadius: 12, padding: 14, marginTop: 12 },
  confirmTitle: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  confirmDescription: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
  confirmActions: { flexDirection: 'row', gap: 10, marginTop: 13 },
  keepButton: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5FD', borderRadius: 10 },
  keepText: { color: COLORS.primaryDark, fontWeight: '700' },
  confirmDeleteButton: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDEEEF', borderRadius: 10 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  loading: { padding: 30, alignItems: 'center', gap: 10 },
  loadingText: { color: COLORS.textSecondary },
});
