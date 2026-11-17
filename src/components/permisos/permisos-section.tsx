import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useDevicePermissions } from '../../hooks/use-device-permissions';
import { COLORS } from '../../constants/colors';

export default function PermisosSection() {
  const {
    permissions,
    loading,
    refreshPermissions,
    requestCamera,
    requestGallery,
    requestNotifications,
  } = useDevicePermissions();

  const items = [
    {
      title: 'Cámara',
      description: 'Permite tomar fotografías.',
      granted: permissions.camera,
      action: requestCamera,
      icon: '📷',
    },
    {
      title: 'Galería',
      description: 'Permite seleccionar imágenes.',
      granted: permissions.gallery,
      action: requestGallery,
      icon: '🖼️',
    },
    {
      title: 'Notificaciones',
      description: 'Permite recibir recordatorios.',
      granted: permissions.notifications,
      action: requestNotifications,
      icon: '🔔',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Consultando permisos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permisos</Text>

      <Text style={styles.subtitle}>
        Consulta y administra los permisos de tu dispositivo.
      </Text>

      {items.map((item) => (
        <View key={item.title} style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <Text style={styles.icon}>{item.icon}</Text>

            <View style={styles.info}>
              <Text style={styles.permissionTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View
              style={[
                styles.status,
                item.granted ? styles.granted : styles.pending,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.granted ? styles.grantedText : styles.pendingText,
                ]}
              >
                {item.granted ? 'Concedido' : 'Pendiente'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.button,
              item.granted && styles.disabled,
            ]}
            onPress={item.action}
            disabled={item.granted}
          >
            <Text style={styles.buttonText}>
              {item.granted ? 'Permiso concedido' : 'Solicitar permiso'}
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        style={styles.refreshButton}
        onPress={refreshPermissions}
      >
        <Text style={styles.refreshText}>Actualizar permisos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 21,
  },
  permissionCard: {
    backgroundColor: '#FAFCFE',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    fontSize: 27,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  permissionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.text,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  granted: {
    backgroundColor: '#E5F7ED',
  },
  pending: {
    backgroundColor: '#FFF3DC',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  grantedText: {
    color: COLORS.success,
  },
  pendingText: {
    color: '#B7791F',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  disabled: {
    opacity: 0.6,
  },
  refreshButton: {
    backgroundColor: '#E8F5FD',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  refreshText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  },
  loading: {
    padding: 35,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
  },
});
