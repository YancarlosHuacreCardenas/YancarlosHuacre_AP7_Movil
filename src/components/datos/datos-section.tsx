import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  saveUserData,
  getUserData,
  deleteUserData,
} from '../../services/storage.service';

import { COLORS } from '../../constants/colors';

export default function DatosSection() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getUserData();

        if (data) {
          setNombre(data.nombre);
          setDescripcion(data.descripcion);
        }
      } catch {
        Alert.alert('Error', 'No se pudieron recuperar los datos.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const guardarDatos = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      Alert.alert('Atención', 'Completa todos los campos.');
      return;
    }

    try {
      await saveUserData({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      });

      Alert.alert('Éxito', 'Información guardada correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  const eliminarDatos = () => {
    Alert.alert(
      'Eliminar información',
      '¿Deseas eliminar los datos guardados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserData();
              setNombre('');
              setDescripcion('');
              Alert.alert('Éxito', 'Información eliminada.');
            } catch {
              Alert.alert('Error', 'No se pudieron eliminar los datos.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <Text style={styles.loading}>Cargando información...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Datos</Text>
      <Text style={styles.subtitle}>
        Registra tu información personal.
      </Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Escribe una descripción..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <Pressable style={styles.saveButton} onPress={guardarDatos}>
        <Text style={styles.buttonText}>Guardar información</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={eliminarDatos}>
        <Text style={styles.deleteText}>Eliminar información</Text>
      </Pressable>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 25,
    color: COLORS.textSecondary,
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FAFCFE',
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FDEEEF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  loading: {
    padding: 30,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
});
