import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Mi App Móvil' }} />
        <Stack.Screen name="perfil" options={{ title: 'Mi Perfil' }} />
        <Stack.Screen name="datos" options={{ title: 'Mis Datos' }} />
        <Stack.Screen name="recordatorios" options={{ title: 'Recordatorios' }} />
        <Stack.Screen name="permisos" options={{ title: 'Permisos' }} />
      </Stack>
    </>
  );
}
