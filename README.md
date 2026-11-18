# 📱 Mi App Móvil

Aplicación educativa desarrollada con **React Native, Expo y Expo Router**, que integra funcionalidades avanzadas del dispositivo móvil para mejorar la experiencia del usuario.

## 🚀 Funcionalidades implementadas

### 1. 🔔 Recordatorios locales

Permite programar y administrar notificaciones locales desde la aplicación.

- Editar el título y el mensaje de la notificación.
- Configurar el tiempo de espera desde 5 segundos hasta 24 horas.
- Programar recordatorios personalizados.
- Visualizar las notificaciones pendientes.
- Cancelar un recordatorio específico.
- Cancelar todos los recordatorios programados.

### 2. 💾 Almacenamiento local – Mis Datos

Permite guardar y recuperar información directamente en el dispositivo.

- Registrar el nombre y la descripción del usuario.
- Guardar información mediante almacenamiento local.
- Recuperar automáticamente los datos guardados al volver a abrir la pantalla.
- Eliminar la información almacenada.
- Confirmar la eliminación antes de ejecutar la acción.

### 3. 📸 Cámara y galería

Permite personalizar el perfil del usuario mediante imágenes.

- Tomar fotografías utilizando la cámara del dispositivo.
- Seleccionar imágenes desde la galería.
- Mostrar la fotografía seleccionada como imagen de perfil.

### 4. 🔐 Administración de permisos

Gestiona los permisos necesarios para utilizar las funcionalidades del dispositivo.

- Solicitar acceso a la cámara.
- Solicitar acceso a la galería.
- Gestionar los permisos de notificaciones.
- Manejar los permisos denegados por el usuario.

---

## 🛠️ Tecnologías utilizadas

- React Native
- Expo
- Expo Router
- JavaScript / TypeScript
- Node.js
- npm
- Expo Notifications
- Expo Camera
- Expo Image Picker
- Almacenamiento local

## ⚙️ Instalación y ejecución

### 1. Instalar las dependencias

```bash
npm ci
```

### 2. Iniciar el proyecto con Expo

```bash
npx expo start
```

### 3. Ejecutar la aplicación

Después de iniciar Expo, puedes:

- Presionar `a` para abrir el emulador Android.
- Escanear el código QR con Expo Go, si las funcionalidades utilizadas son compatibles con Expo Go.
- Utilizar un dispositivo físico para probar las funcionalidades.

**Importante:** Las notificaciones locales deben probarse en un entorno compatible con Android o iOS. Algunas funcionalidades y permisos pueden requerir un development build en lugar de Expo Go.

---

## 🧪 Pruebas de funcionamiento

Se deben verificar los siguientes escenarios:

| Funcionalidad | Prueba |
|---|---|
| Recordatorios | Programar una notificación y comprobar su recepción. |
| Administración | Visualizar y cancelar recordatorios pendientes. |
| Almacenamiento | Guardar nombre y descripción. |
| Recuperación | Cerrar y volver a abrir la pantalla para comprobar los datos. |
| Eliminación | Borrar la información y confirmar la acción. |
| Cámara | Tomar una fotografía para el perfil. |
| Galería | Seleccionar una imagen del dispositivo. |
| Permisos | Comprobar las solicitudes y respuestas de permisos. |

## 📸 Evidencias de entrega

Para demostrar la implementación se adjuntarán las siguientes evidencias:

1. Captura de la pantalla principal de la aplicación.
2. Captura de la funcionalidad de recordatorios.
3. Captura de una notificación local recibida.
4. Captura del almacenamiento de información.
5. Captura de la eliminación de información.
6. Captura de la cámara y selección de imágenes desde la galería.
7. Video breve demostrando el funcionamiento de la aplicación.

## 📂 Estructura del proyecto

La aplicación mantiene una organización modular utilizando Expo Router para la navegación y componentes independientes para sus funcionalidades.

```text
mi-app-movil/
├── app/
│   ├── (tabs)/
│   ├── recordatorios/
│   └── mis-datos/
├── assets/
├── components/
├── hooks/
├── package.json
├── package-lock.json
├── app.json
└── README.md
```

*La estructura mostrada es referencial y debe ajustarse a las carpetas reales del proyecto.*

---

## 🎓 Información académica

**Actividad:** Implementación de funcionalidades avanzadas en aplicaciones móviles.

**Modalidad:** Individual.

**Objetivo:** Implementar funcionalidades avanzadas utilizando React Native y Expo, integrando recursos del dispositivo móvil y almacenamiento local para mejorar la experiencia del usuario.

**Estado:** Funcionalidades implementadas y listas para su verificación en un emulador o dispositivo móvil.