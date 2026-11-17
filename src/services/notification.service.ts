import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
const CHANNEL_ID = 'recordatorios';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
export async function configureNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') throw new Error('Prueba las notificaciones desde Android o iOS.');
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: 'Recordatorios', importance: AndroidImportance.DEFAULT });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Debes conceder permiso para recibir notificaciones.');
  return true;
}
export async function scheduleReminder(seconds = 5): Promise<string> {
  if (!Number.isInteger(seconds) || seconds < 5 || seconds > 86400) throw new Error('El intervalo debe estar entre 5 segundos y 24 horas.');
  await configureNotifications();
  return Notifications.scheduleNotificationAsync({ content: { title: '¡Hola! 👋', body: 'Tu recordatorio de Mi App Móvil está funcionando.', sound: 'default', data: { screen: 'recordatorios' } }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}) } });
}
export async function getScheduledReminderCount(): Promise<number> { return (await Notifications.getAllScheduledNotificationsAsync()).length; }
export async function cancelAllReminders(): Promise<void> { await Notifications.cancelAllScheduledNotificationsAsync(); }
