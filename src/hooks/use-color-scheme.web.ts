import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/** Keeps the server render light until the browser has hydrated. */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme();

  useEffect(() => {
    const hydrationTimer = setTimeout(() => setHasHydrated(true), 0);
    return () => clearTimeout(hydrationTimer);
  }, []);

  return hasHydrated ? colorScheme : 'light';
}
