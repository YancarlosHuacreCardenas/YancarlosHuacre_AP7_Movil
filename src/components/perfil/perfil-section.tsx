import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  saveProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
} from '../../services/storage.service';

import { COLORS } from '../../constants/colors';

export default function PerfilSection() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar la fotografía cuando se abre la pantalla
  useEffect(() => {
    const cargarFotografia = async () => {
      try {
        const savedPhoto = await getProfilePhoto();
        setImageUri(savedPhoto);
      } catch (error) {
        Alert.alert('Error', 'No se pudo recuperar la fotografía.');
      } finally {
        setLoading(false);
      }
    };

    cargarFotografia();
  }, []);

  // Guardar la fotografía seleccionada
  const actualizarFotografia = async (uri: string) => {
    try {
      await saveProfilePhoto(uri);
      setImageUri(uri);
      Alert.alert('Éxito', 'Fotografía guardada correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la fotografía.');
    }
  };

  // Abrir la cámara
  const tomarFotografia = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso denegado',
          'Debes permitir el acceso a la cámara.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        await actualizarFotografia(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  // Abrir la galería
  const seleccionarGaleria = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso denegado',
          'Debes permitir el acceso a la galería.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        await actualizarFotografia(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  // Eliminar fotografía
  const eliminarFotografia = () => {
    Alert.alert(
      'Eliminar fotografía',
      '¿Deseas eliminar tu fotografía de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfilePhoto();
              setImageUri(null);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la fotografía.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.subtitle}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <Text style={styles.subtitle}>
        Personaliza tu perfil con una fotografía.
      </Text>

      <View style={styles.photoContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.photo}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>👤</Text>
            <Text style={styles.placeholderText}>
              Sin fotografía
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.instruction}>
        Selecciona cómo deseas agregar tu fotografía.
      </Text>

      <Pressable
        style={styles.primaryButton}
        onPress={tomarFotografia}
      >
        <Text style={styles.buttonText}>
          📷 Tomar fotografía
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={seleccionarGaleria}
      >
        <Text style={styles.secondaryButtonText}>
          🖼️ Seleccionar desde galería
        </Text>
      </Pressable>

      {imageUri && (
        <Pressable
          style={styles.deleteButton}
          onPress={eliminarFotografia}
        >
          <Text style={styles.deleteText}>
            Eliminar fotografía
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  photoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E8F5FD',
    marginTop: 25,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 65,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },
  instruction: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E8F5FD',
    padding: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FDEEEF',
    padding: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  loading: {
    padding: 35,
    alignItems: 'center',
  },
});
