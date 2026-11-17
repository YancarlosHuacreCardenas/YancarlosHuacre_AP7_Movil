import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

const CHANNEL_ID = 'recordatorios';
export type ScheduledReminder = Notifications.NotificationRequest;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') {
    throw new Error('Prueba las notificaciones desde Android o iOS.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Recordatorios',
      importance: AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Debes conceder permiso para recibir notificaciones.');
  return true;
}

export async function scheduleReminder(
  seconds = 10,
  title = 'Recordatorio',
  body = 'Es momento de revisar tu app.',
): Promise<string> {
  if (!Number.isInteger(seconds) || seconds < 5 || seconds > 86400) {
    throw new Error('El intervalo debe estar entre 5 segundos y 24 horas.');
  }
  if (!title.trim() || !body.trim()) throw new Error('Escribe un título y un mensaje para el recordatorio.');

  await configureNotifications();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: title.trim(),
      body: body.trim(),
      sound: 'default',
      data: { screen: 'recordatorios' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
  });
}

export async function getScheduledReminders(): Promise<ScheduledReminder[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

export async function cancelReminder(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
