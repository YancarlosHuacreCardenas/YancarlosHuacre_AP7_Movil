import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

const sections = [
  {
    title: 'Mi Perfil',
    description: 'Administra tu fotografía de perfil',
    icon: '👤',
    route: '/perfil',
  },
  {
    title: 'Mis Datos',
    description: 'Registra y guarda tu información',
    icon: '📝',
    route: '/datos',
  },
  {
    title: 'Recordatorios',
    description: 'Programa notificaciones locales',
    icon: '🔔',
    route: '/recordatorios',
  },
  {
    title: 'Permisos',
    description: 'Administra los permisos del dispositivo',
    icon: '🛡️',
    route: '/permisos',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Bienvenido!</Text>

        <Text style={styles.title}>
          Mi App Móvil
        </Text>

        <Text style={styles.subtitle}>
          Aprende y explora las funcionalidades de tu dispositivo.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Mis funcionalidades
        </Text>

        <Text style={styles.sectionSubtitle}>
          Selecciona una sección para comenzar
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {sections.map((section) => (
          <Pressable
            key={section.title}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push(section.route as never)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>
                {section.icon}
              </Text>
            </View>

            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>
                {section.title}
              </Text>

              <Text style={styles.cardDescription}>
                {section.description}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Mi App Móvil · Proyecto educativo
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: 25,
    borderRadius: 22,
    marginBottom: 32,
  },

  greeting: {
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 22,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  cardsContainer: {
    gap: 15,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
  },

  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#E8F5FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  icon: {
    fontSize: 27,
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  arrow: {
    fontSize: 28,
    color: COLORS.primary,
    marginLeft: 8,
  },

  footer: {
    marginTop: 30,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
