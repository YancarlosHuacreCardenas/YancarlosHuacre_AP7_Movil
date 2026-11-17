import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  nombre: string;
  descripcion: string;
}

const USER_DATA_KEY = '@mi_app/user_data';
const PROFILE_PHOTO_KEY = '@mi_app/profile_photo';

// Guardar los datos personales
export async function saveUserData(data: UserData): Promise<void> {
  const jsonValue = JSON.stringify(data);
  await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
}

// Recuperar los datos personales
export async function getUserData(): Promise<UserData | null> {
  const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);

  if (!jsonValue) {
    return null;
  }

  return JSON.parse(jsonValue) as UserData;
}

// Eliminar los datos personales
export async function deleteUserData(): Promise<void> {
  await AsyncStorage.removeItem(USER_DATA_KEY);
}

// Guardar la ruta de la fotografía de perfil
export async function saveProfilePhoto(uri: string): Promise<void> {
  await AsyncStorage.setItem(PROFILE_PHOTO_KEY, uri);
}

// Recuperar la fotografía de perfil
export async function getProfilePhoto(): Promise<string | null> {
  return await AsyncStorage.getItem(PROFILE_PHOTO_KEY);
}

// Eliminar la fotografía de perfil
export async function deleteProfilePhoto(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_PHOTO_KEY);
}
