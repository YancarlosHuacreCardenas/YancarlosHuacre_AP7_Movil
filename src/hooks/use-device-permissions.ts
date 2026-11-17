import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

export interface DevicePermissions {
  camera: boolean;
  gallery: boolean;
  notifications: boolean;
}

export function useDevicePermissions() {
  const [permissions, setPermissions] = useState<DevicePermissions>({
    camera: false,
    gallery: false,
    notifications: false,
  });

  const [loading, setLoading] = useState(true);

  const refreshPermissions = useCallback(async () => {
    try {
      const [camera, gallery, notifications] = await Promise.all([
        ImagePicker.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

      setPermissions({
        camera: camera.granted,
        gallery: gallery.granted,
        notifications: notifications.granted,
      });
    } catch (error) {
      console.error('Error consultando permisos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPermissions();

    const subscription = AppState.addEventListener(
      'change',
      (state) => {
        if (state === 'active') {
          refreshPermissions();
        }
      },
    );

    return () => subscription.remove();
  }, [refreshPermissions]);

  const requestCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      await refreshPermissions();
    } catch (error) {
      console.error('Error solicitando cámara:', error);
    }
  };

  const requestGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await refreshPermissions();
    } catch (error) {
      console.error('Error solicitando galería:', error);
    }
  };

  const requestNotifications = async () => {
    try {
      if (process.env.EXPO_OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          'recordatorios',
          {
            name: 'Recordatorios',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
          },
        );
      }

      await Notifications.requestPermissionsAsync();
      await refreshPermissions();
    } catch (error) {
      console.error('Error solicitando notificaciones:', error);
    }
  };

  return {
    permissions,
    loading,
    refreshPermissions,
    requestCamera,
    requestGallery,
    requestNotifications,
  };
}
