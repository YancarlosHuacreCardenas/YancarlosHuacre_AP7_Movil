# Mi App M�vil

Aplicaci�n educativa desarrollada con React Native, Expo y Expo Router.

## Funcionalidad avanzada: recordatorios locales

En la pantalla **Recordatorios** puedes programar una notificaci�n local con un intervalo entre 5 segundos y 24 horas, consultar cu�ntos avisos siguen pendientes y cancelar todos los avisos programados. La app solicita permiso antes de programar notificaciones y configura un canal en Android.

## Ejecutar

1. Instala Node.js y Android Studio con un emulador configurado.
2. Ejecuta npm ci.
3. Inicia Expo con npx expo start y abre la app en el emulador Android.
4. Entra en **Recordatorios**, concede el permiso, escribe un intervalo (por ejemplo, 5) y pulsa **Programar recordatorio**.
5. Comprueba el contador y la notificaci�n; prueba tambi�n **Cancelar todos los pendientes**.

Las notificaciones locales requieren Android o iOS. La vista web no las programa.

## Evidencias para la entrega

- Captura de la pantalla Recordatorios con el tiempo configurable y el contador.
- Captura de la notificaci�n recibida y del contador actualizado.
- Video breve grabado desde el emulador o dispositivo mostrando el flujo.
- Repositorio actualizado con estos cambios.

## Otras secciones

La app tambi�n incluye perfil con c�mara/galer�a, almacenamiento local de informaci�n personal y administraci�n de permisos del dispositivo.
