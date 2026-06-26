import { Platform } from 'react-native';

/**
 * Resuelve una URL de imagen de manera dinámica.
 * Si es una URL relativa (ej. /sofia-mendez/1.jpg), la convierte en absoluta
 * usando la dirección del host de desarrollo (10.0.2.2 para emuladores Android, localhost para web).
 */
export function getFullImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // En emulador Android, 10.0.2.2 apunta al localhost del PC host.
  // En Web o iOS, se puede acceder mediante localhost.
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `http://${host}:3000${cleanPath}`;
}
