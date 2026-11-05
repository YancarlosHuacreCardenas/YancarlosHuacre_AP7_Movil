import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';

const CHANNEL_ID = 'recordatorios';
const WEB_REMINDERS_KEY = '@mi_app/web_reminders';
const WEB_REMINDERS_EVENT = 'mi-app:web-reminders-updated';

export interface ScheduledReminder {
  identifier: string;
  content: { title: string | null; body: string | null };
  fireAt?: number;
}

type WebReminder = ScheduledReminder & { fireAt: number };
const webTimers = new Map<string, ReturnType<typeof setTimeout>>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function readWebReminders(): WebReminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(WEB_REMINDERS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is WebReminder =>
      typeof item?.identifier === 'string' &&
      typeof item?.fireAt === 'number' &&
      typeof item?.content?.title === 'string' &&
      typeof item?.content?.body === 'string',
    );
  } catch {
    return [];
  }
}

function writeWebReminders(reminders: WebReminder[]) {
  if (typeof window === 'undefined') throw new Error('No se pudo acceder al almacenamiento del navegador.');
  window.localStorage.setItem(WEB_REMINDERS_KEY, JSON.stringify(reminders));
}

function announceWebReminderChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(WEB_REMINDERS_EVENT));
}

function armWebReminder(reminder: WebReminder) {
  if (typeof window === 'undefined' || webTimers.has(reminder.identifier)) return;
  const delay = Math.max(0, reminder.fireAt - Date.now());
  const timer = setTimeout(() => {
    try {
      new window.Notification(reminder.content.title || 'Recordatorio', {
        body: reminder.content.body || '',
        tag: reminder.identifier,
      });
    } catch {
      // The reminder still expires if the browser closes notification display.
    }
    webTimers.delete(reminder.identifier);
    writeWebReminders(readWebReminders().filter((item) => item.identifier !== reminder.identifier));
    announceWebReminderChange();
  }, delay);
  webTimers.set(reminder.identifier, timer);
}

export async function configureNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      throw new Error('Este navegador no admite notificaciones. Prueba con Chrome, Edge o Firefox.');
    }
    if (!window.isSecureContext) {
      throw new Error('Las notificaciones requieren HTTPS o localhost.');
    }
    let permission = window.Notification.permission;
    if (permission === 'default') permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permite las notificaciones de este sitio para recibir el aviso.');
    }
    return true;
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
  if (Platform.OS === 'web') {
    const reminder: WebReminder = {
      identifier: 'web-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      content: { title: title.trim(), body: body.trim() },
      fireAt: Date.now() + seconds * 1000,
    };
    writeWebReminders([...readWebReminders(), reminder]);
    armWebReminder(reminder);
    announceWebReminderChange();
    return reminder.identifier;
  }

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
  if (Platform.OS === 'web') {
    const reminders = readWebReminders();
    reminders.forEach(armWebReminder);
    return reminders;
  }
  const reminders = await Notifications.getAllScheduledNotificationsAsync();
  return reminders.map((item) => ({ identifier: item.identifier, content: { title: item.content.title, body: item.content.body } }));
}

export async function cancelReminder(identifier: string): Promise<void> {
  if (Platform.OS === 'web') {
    const timer = webTimers.get(identifier);
    if (timer) clearTimeout(timer);
    webTimers.delete(identifier);
    writeWebReminders(readWebReminders().filter((item) => item.identifier !== identifier));
    announceWebReminderChange();
    return;
  }
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') {
    webTimers.forEach(clearTimeout);
    webTimers.clear();
    writeWebReminders([]);
    announceWebReminderChange();
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}
