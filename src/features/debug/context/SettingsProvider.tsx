import {
  SettingsContext,
  type SettingsContextType,
  type SettingsValue,
} from '@/features/debug/context/SettingsContext';
import { useRef } from 'react';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsRef = useRef<Record<string, SettingsValue>>({});

  const contextValue: SettingsContextType = {
    set: (key, value) => {
      settingsRef.current[key] = value;
    },
    get: (key) => settingsRef.current[key],
    has: (key) => key in settingsRef.current,
    remove: (key) => {
      delete settingsRef.current[key];
    },
    getAll: () => ({ ...settingsRef.current }),
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
